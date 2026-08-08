"""分批 ViT 推理脚本，降低峰值内存。

在 16GB 内存的机器上通过分批处理 ViT patches 来避免 swap。
用法: python run_batched.py
"""
from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F

from sharp.models import PredictorParams, create_predictor
from sharp.models.encoders.vit_encoder import TimmViT
from sharp.utils import io
from sharp.utils import logging as logging_utils
from sharp.utils.gaussians import save_ply, unproject_gaussians

logging_utils.configure(logging.INFO)
LOGGER = logging.getLogger(__name__)

DEFAULT_MODEL_URL = "https://ml-site.cdn-apple.com/models/sharp/sharp_2572gikvuh.pt"

INPUT = "/Users/xiatian/Desktop/jd.png"
OUTPUT_DIR = Path("/Users/xiatian/Desktop/jd_output")
DEVICE = "cpu"
BATCH_SIZE = 5  # ViT 每批处理的 patch 数量（原始为 35 个一起处理）

# 保存原始 forward
_original_vit_forward = TimmViT.forward


def _batched_vit_forward(self, input_tensor):
    """分批处理 ViT forward，降低峰值内存。"""
    total_batch = input_tensor.shape[0]
    if total_batch <= BATCH_SIZE:
        return _original_vit_forward(self, input_tensor)

    LOGGER.info("分批 ViT 推理: %d patches, 每批 %d", total_batch, BATCH_SIZE)

    all_features = []
    all_intermediate = {}

    for start in range(0, total_batch, BATCH_SIZE):
        end = min(start + BATCH_SIZE, total_batch)
        batch = input_tensor[start:end]
        LOGGER.info("  ViT 批次 %d-%d / %d", start, end, total_batch)

        features, intermediate = _original_vit_forward(self, batch)
        all_features.append(features)

        # 拼接 intermediate features (dict[int, tensor])
        for key, val in intermediate.items():
            if key not in all_intermediate:
                all_intermediate[key] = [val]
            else:
                all_intermediate[key].append(val)

        # 清理缓存
        del features, intermediate, batch

    # 合并结果
    final_features = torch.cat(all_features, dim=0)
    final_intermediate = {k: torch.cat(v, dim=0) for k, v in all_intermediate.items()}

    return final_features, final_intermediate


@torch.no_grad()
def main():
    # 安装 monkey-patch
    TimmViT.forward = _batched_vit_forward
    LOGGER.info("已安装分批 ViT forward (batch_size=%d)", BATCH_SIZE)

    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)

    LOGGER.info("Loading checkpoint (cached at ~/.cache/torch/hub/).")
    state_dict = torch.hub.load_state_dict_from_url(DEFAULT_MODEL_URL, progress=True)

    LOGGER.info("Creating predictor (float32 on %s).", DEVICE)
    predictor = create_predictor(PredictorParams())
    predictor.load_state_dict(state_dict)
    predictor.eval()
    predictor = predictor.to(DEVICE)

    LOGGER.info("Loading image %s", INPUT)
    image, _, f_px = io.load_rgb(Path(INPUT))
    height, width = image.shape[:2]
    LOGGER.info("Image size: %dx%d, f_px=%.2f", height, width, f_px)

    internal_shape = (1536, 1536)
    image_pt = torch.from_numpy(image.copy()).float().to(DEVICE).permute(2, 0, 1) / 255.0
    disparity_factor = torch.tensor([f_px / width]).float().to(DEVICE)

    image_resized = F.interpolate(
        image_pt[None], size=(internal_shape[1], internal_shape[0]),
        mode="bilinear", align_corners=True,
    )

    LOGGER.info("Running inference (batched ViT, float32, %s).", DEVICE)
    gaussians_ndc = predictor(image_resized, disparity_factor)
    LOGGER.info("Inference done. Running postprocessing.")

    intrinsics = (
        torch.tensor([
            [f_px, 0, width / 2, 0],
            [0, f_px, height / 2, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ])
        .float().to(DEVICE)
    )
    intrinsics_resized = intrinsics.clone()
    intrinsics_resized[0] *= internal_shape[0] / width
    intrinsics_resized[1] *= internal_shape[1] / height

    gaussians = unproject_gaussians(
        gaussians_ndc, torch.eye(4).to(DEVICE), intrinsics_resized, internal_shape
    )

    out_ply = OUTPUT_DIR / "jd.ply"
    LOGGER.info("Saving 3DGS to %s", out_ply)
    save_ply(gaussians, f_px, (height, width), out_ply)
    LOGGER.info("Done! Output: %s", out_ply)


if __name__ == "__main__":
    main()
