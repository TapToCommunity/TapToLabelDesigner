import type { MediaDefinition } from "./resourcesTypedef";

// Media definition define the media the label is planned to be applied to.
// Those options represent both canvas size and clipPath structure,
// and so are props of Fabric.Rect


// a standard credit card sized nfc card
export const NFCCCsizeCard: MediaDefinition = {
  width: 1004, // 3.346inch * 300dpi (85mm)
  height: 638, // 2.126inch * 300dpi, (54mm)
  rx: 35,
  ry: 35,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
};

// or a musicasset box inlay cover
export const TapeBoxCover: MediaDefinition = {
  width: 1233, // 4.11inch * 300dpi (85mm)
  height: 1200, // 4inch * 300dpi, (54mm)
  rx: 0,
  ry: 0,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
};

export const boxShadow =
  '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)';
