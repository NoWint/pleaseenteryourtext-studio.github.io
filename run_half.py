"""float16 半精度推理脚本，降低内存占用。

用法: python run_half.py
"""
from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F

from sharp.models import PredictorParams, create_predictor
from sharp.utils import io
from sharp.utils import logging as logging_utils
from sharp.utils.gaussians import save_ply, unproject_gaussians

logging_utils.configure(logging.INFO)
LOGGER = logging.getLogger(__name__)

DEFAULT_MODEL_URL = "https://ml-site.cdn-apple.com/models/sharp/sharp_2572gikvuh.pt"

INPUT = "/Users/xiatian/Desktop/jd.png"
OUTPUT_DIR = Path("/Users/xiatian/Desktop/jd_output")
DEVICE = "mps"
DTYPE = torch.float16


@torch.no_grad()
def main():
    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)

    LOGGER.info("Loading checkpoint (cached at ~/.cache/torch/hub/).")
    state_dict = torch.hub.load_state_dict_from_url(DEFAULT_MODEL_URL, progress=True)

    LOGGER.info("Creating predictor (float32).")
    predictor = create_predictor(PredictorParams())
    predictor.load_state_dict(state_dict)
    predictor.eval()

    LOGGER.info("Converting predictor to %s on %s.", DTYPE, DEVICE)
    predictor = predictor.to(dtype=DTYPE, device=DEVICE)

    LOGGER.info("Loading image %s", INPUT)
    image, _, f_px = io.load_rgb(Path(INPUT))
    height, width = image.shape[:2]
    LOGGER.info("Image size: %dx%d, f_px=%.2f", height, width, f_px)

    internal_shape = (768, 768)
    image_pt = torch.from_numpy(image.copy()).float().to(DEVICE).permute(2, 0, 1) / 255.0
    _, h, w = image_pt.shape
    disparity_factor = torch.tensor([f_px / width]).float().to(DEVICE)

    image_resized = F.interpolate(
        image_pt[None], size=(internal_shape[1], internal_shape[0]),
        mode="bilinear", align_corners=True,
    )

    # 半精度推理
    image_resized = image_resized.to(DTYPE)
    disparity_factor = disparity_factor.to(DTYPE)

    LOGGER.info("Running inference (float16).")
    gaussians_ndc = predictor(image_resized, disparity_factor)
    LOGGER.info("Inference done. Converting back to float32 for postprocessing.")

    # 后处理用 float32 保证数值精度
    gaussians_ndc = {k: v.float() for k, v in gaussians_ndc.items()}

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
