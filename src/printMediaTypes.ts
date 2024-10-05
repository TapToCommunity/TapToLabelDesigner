/**
 * A list of all the support label target for the app.
 */

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
  label: 'Standard NFC card'
};

// or a musicasset box inlay cover
export const TapeBoxCover: MediaDefinition = {
  width: 1233, // 4.11inch * 300dpi
  height: 1200, // 4inch * 300dpi
  rx: 0,
  ry: 0,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
  label: 'Cassette tape case',
};

// or a musicasset box inlay cover
export const taptoPrePrintedHalf: MediaDefinition = {
  width: 744, // 63mm * 300dpi
  height: 425, // 36mm * 300dpi
  rx: 0,
  ry: 0,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
  label: 'Tapto pre-printed, half',
};

// or a musicasset box inlay cover
export const taptoPrePrintedFullHeight: MediaDefinition = {
  width: 862, // 4.11inch * 300dpi
  height: 744, // 63mm * 300dpi
  rx: 0,
  ry: 0,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
  label: 'Tapto pre-printed, full',
};

// or a musicasset box inlay cover
export const miniNfcCard: MediaDefinition = {
  width: 591, //5cm * 300dpi
  height: 354, // 63mm * 300dpi
  rx: 8,
  ry: 8,
  strokeWidth: 2,
  stroke: 'black',
  fill: 'white',
  label: 'Small nfc card 3x5cm',
};

export const mediaTargetList = [
  NFCCCsizeCard,
  TapeBoxCover,
  taptoPrePrintedHalf,
  taptoPrePrintedFullHeight,
  miniNfcCard,
];