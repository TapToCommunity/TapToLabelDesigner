import taptoPcEngineHorizontal from './assets/tapto_pcengine_horizontal.svg';
import tapToHorizontal from './assets/tapto_horizontal.svg';

export const cardLikeOptions = {
  width: 1009,
  height: 637,
  rx: 30,
  ry: 30,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
};

export const cardRatio = 855 / 540;

type templateLayer = {
  url: string;
  /* percentage width where the overlaye transparent area begins */
  x: number;
  /* percentage height where the overlaye transparent area begins */
  y: number;
  /* percentage width that is transparent */
  width: number;
  /* percentage height that is transparent */
  height: number;
  /* how large the overlay is */
  layerWidth: number;
  layerHeight: number;
};

type templateType = {
  overlay?: templateLayer;
  background?: templateLayer;
  label: string;
};

export const templates: Record<string, templateType> = {
  // tapto1: {
  //   overlay: {
  //     layerWidth: 975,
  //     layerHeight: 600,
  //     url: taptoPcEngineHorizontal,
  //     width: 702 / 975,
  //     height: 547 / 600,
  //     x: 26 / 975,
  //     y: 27 / 600,
  //   },
  //   label: 'PC-Engine',
  // },
  tapto2: {
    overlay: {
      layerWidth: 975,
      layerHeight: 600,
      url: tapToHorizontal,
      width: 0.66,
      height: 0.88,
      x: 0.30,
      y: 0.06,
    },
    label: 'Tap-to',
  },
} as const;
