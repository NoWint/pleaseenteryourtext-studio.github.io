import type { ElementType, ReactNode } from 'react';
import styles from './PrismText.module.css';

interface PrismTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function PrismText({ children, as: Tag = 'span', className }: PrismTextProps) {
  return (
    <Tag className={`${styles.prism} ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
