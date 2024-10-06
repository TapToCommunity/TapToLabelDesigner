import { cassetteColorVariations, referencColorTable } from './cassetteColorVariations.mjs';
import { readFileSync, writeFileSync } from 'fs';

const templateSvg = readFileSync('./scripts/cassette/cassetteMasterFile.svg', 'utf-8');

for (const variation of cassetteColorVariations) {
  const newTemplate = templateSvg
    .replace(referencColorTable.backColor, variation.backColor)
    .replace(referencColorTable.colorSpineTop, variation.colorSpineTop)
    .replace(referencColorTable.colorSpineBottom, variation.colorSpineBottom)
    .replace(referencColorTable.frontcolorTop, variation.frontcolorTop)
    .replace(referencColorTable.frontcolorBottom, variation.frontcolorTop)
    .replace(referencColorTable.loadingLogoBack, variation.loadingLogoBack)
    .replace(referencColorTable.loadingLogoSpine, variation.loadingLogoSpine)
    .replace(referencColorTable.loadingLogoFront, variation.loadingLogoFront)
    .replace(referencColorTable.nfcLogoBack, variation.nfcLogoBack)
    .replace(referencColorTable.nfcLogoSpine, variation.nfcLogoSpine)
    .replace(referencColorTable.nfcLogoFront, variation.nfcLogoFront);
  writeFileSync(`./src/assets/cassetteGenerated/${variation.label}.svg`, newTemplate)
  console.log(`Generated ${variation.label}`);
} 