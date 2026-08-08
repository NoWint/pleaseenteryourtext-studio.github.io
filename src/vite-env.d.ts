/// <reference types="vite/client" />

declare module '@mkkellogg/gaussian-splats-3d' {
  export class Viewer {
    constructor(options?: Record<string, unknown>);
    addSplatScene(path: string, options?: Record<string, unknown>): Promise<void>;
    start(): void;
    dispose(): void;
    camera: unknown;
  }
}
