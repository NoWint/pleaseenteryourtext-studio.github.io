import { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import styles from './QrCode.module.css';

export interface QrCodeProps {
  value: string;
  size?: number;        // 像素尺寸
  ecc?: 'L' | 'M' | 'Q' | 'H';
  title?: string;       // 无障碍标题
}

/**
 * 二维码生成组件 — 纯黑白 SVG，无图片依赖
 * 基于 qrcode-generator（零依赖经典库）渲染矩阵为 SVG <rect> 阵列
 */
export function QrCode({ value, size = 200, ecc = 'M', title = 'QR Code' }: QrCodeProps) {
  const { rects, moduleCount } = useMemo(() => {
    const qr = qrcode(0, ecc);
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    const darkRects: string[] = [];
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          darkRects.push(`${c},${r}`);
        }
      }
    }
    return { rects: darkRects, moduleCount: count };
  }, [value, ecc]);

  const unit = 100 / moduleCount;

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
      {rects.map((rc) => {
        const [c, r] = rc.split(',').map(Number);
        return (
          <rect
            key={`${r}-${c}`}
            x={c * unit}
            y={r * unit}
            width={unit}
            height={unit}
            fill="#000000"
          />
        );
      })}
    </svg>
  );
}
