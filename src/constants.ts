import taptoOverlayImg from './assets/tapto_label.svg';

export const cardLikeOptions = {
  width: 854,
  height: 539,
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
};

type templateType = {
  overlay?: templateLayer
  background?: templateLayer;
  label: string;
}

export const templates: Record<string, templateType> = {
  tapto: {
    overlay: {
      url: taptoOverlayImg,
      width: 702 / 975,
      height: 547 / 600,
      x: 26 / 975,
      y: 27 / 600,
    },
    label: 'PC-Engine',
  }
} as const;