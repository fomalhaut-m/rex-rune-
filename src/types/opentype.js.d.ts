/**
 * opentype.js 局部类型声明（v2.x）
 * 仅声明本项目用到的 API 表面，避免引入过重 @types
 */
declare module 'opentype.js' {
  export interface Font {
    unitsPerEm: number;
    numGlyphs: number;
    names: {
      fontFamily?: Record<string, string>;
      fontSubfamily?: Record<string, string>;
      designer?: Record<string, string>;
    };
    glyphs: { get(index: number): Glyph };
    charToGlyph(char: string): Glyph;
    getPath(text: string, x: number, y: number, fontSize: number): Path;
    getAdvanceWidth(text: string, fontSize: number): number;
  }

  export interface Glyph {
    index: number;
    name: string;
    unicode?: number;
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }

  export interface Path {
    commands: unknown[];
    getBoundingBox(): { x1: number; y1: number; x2: number; y2: number };
    toPathData(decimalPlaces?: number): string;
    toSVG(decimalPlaces?: number): string;
    draw(ctx: CanvasRenderingContext2D): void;
  }

  export function parse(buffer: ArrayBuffer | Uint8Array): Font;
  export function load(url: string): Promise<Font>;

  const opentype: {
    parse: typeof parse;
    load: typeof load;
    Font: new (opts: object) => Font;
  };
  export default opentype;
}