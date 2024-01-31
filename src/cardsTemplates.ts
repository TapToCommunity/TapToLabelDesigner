import tapToHorizontal from './assets/tapto_horizontal.svg';
import tapToVertical from './assets/tapto_vertical.svg';
import tapToBg from './assets/tapto_pattern_bg.svg';
import tapToBgV from './assets/tapto_pattern_bg_vertical.svg';
import tapToHu from './assets/tapto_hucard.svg';
import tapToHuBg from './assets/tapto_hucard_bg.svg';
import emptyVertical from './assets/empty_vertical.svg';
import emptyHorizontal from './assets/empty_horizontal.svg';

import { type SerializedGroupProps } from 'fabric';

export type templateLayer = {
  url: string;
  /* how large the overlay is */
  layerWidth: number;
  layerHeight: number;
  /* parse the layer as a group rather than raster */
  isSvg: boolean;
  parsed?: Promise<SerializedGroupProps | HTMLImageElement>;
};

export type templateOverlay = templateLayer & {
  /* percentage width where the overlaye transparent area begins */
  x: number;
  /* percentage height where the overlaye transparent area begins */
  y: number;
  /* percentage width that is transparent */
  width: number;
  /* percentage height that is transparent */
  height: number;
};

export type layoutOrientation = 'horizontal' | 'vertical';

export type templateType = {
  layout: layoutOrientation;
  overlay?: templateOverlay;
  background?: templateLayer;
  label: string;
  /* box-shadow like property for the main image, 3 numbers + color */
  shadow?: string;
};

export const templates: Record<string, templateType> = {
  blank: {
    layout: 'horizontal',
    label: 'Blank H cover',
  },
  blankV: {
    layout: 'vertical',
    label: 'Blank V cover',
  },
  blankHF: {
    layout: 'horizontal',
    label: 'Blank H fit',
    overlay: {
      // full card size
      url: emptyHorizontal,
      layerWidth: 975,
      layerHeight: 600,
      x: 0.04,
      width: 0.92,
      y: 0.02,
      height: 0.96,
      isSvg: true,
    },
  },
  blankVF: {
    layout: 'vertical',
    label: 'Blank V fit',
    overlay: {
      // full card size
      url: emptyVertical,
      layerWidth: 600,
      layerHeight: 975,
      x: 0.02,
      width: 0.96,
      y: 0.04,
      height: 0.92,
      isSvg: true,
    },
  },
  tapto2: {
    layout: 'horizontal',
    overlay: {
      layerWidth: 994,
      layerHeight: 619,
      url: tapToHorizontal,
      width: 1 - (310 + 37) / 994,
      height: 1 - (37 * 2) / 619,
      x: 310 / 994,
      y: 37 / 619,
      isSvg: true,
    },
    shadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
    background: {
      layerWidth: 994,
      layerHeight: 619,
      url: tapToBg,
      isSvg: true,
    },
    label: 'Tap-to H',
  },
  tapto3: {
    layout: 'vertical',
    overlay: {
      layerWidth: 600,
      layerHeight: 975,
      url: tapToVertical,
      width: 1 - (47 * 2) / 600,
      height: 1 - (47 + 147) / 975,
      x: 47 / 600,
      y: 47 / 975,
      isSvg: true,
    },
    shadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
    background: {
      layerWidth: 600,
      layerHeight: 975,
      url: tapToBgV,
      isSvg: false,
    },
    label: 'Tap-to V',
  },
  hucard: {
    layout: 'vertical',
    overlay: {
      layerWidth: 619,
      layerHeight: 994,
      url: tapToHu,
      height: 1 - (84 + 268) / 994,
      width: 1 - (37 * 2) / 619,
      y: 268 / 994,
      x: 37 / 619,
      isSvg: true,
    },
    shadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
    background: {
      layerWidth: 619,
      layerHeight: 994,
      url: tapToHuBg,
      isSvg: true,
    },
    label: 'HuCard',
  },
} as const;

export const defaultTemplateKey = 'tapto2';
export const defaultTemplate = templates[defaultTemplateKey];
