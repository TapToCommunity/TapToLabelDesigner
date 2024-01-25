/* eslint-disable @typescript-eslint/no-explicit-any */
import { FabricImage, FabricObject, ImageProps, StaticCanvas } from "fabric";
import BlobStream from 'blob-stream';

export const createDownloadStream = (pdfDoc: any) => new Promise((resolve) => {
  const stream = pdfDoc.pipe(BlobStream());
  stream.on('finish', () => {
    resolve(stream.toBlob('application/pdf'));
  });
});

type box = {
  x: number;
  y: number;
  width: number;
  height: number;
}

// fabric.EditorPath.prototype.renderPdfKit = function (pdfDoc, artboard) {
//   const fill = new fabric.Color(this.fill);
//   const stroke = new fabric.Color(this.stroke);
//   pdfDoc.save();
//   const objectMatrix = this.calcTransformMatrix();
//   const matrix = fabric.util.multiplyTransformMatrices(
//     objectMatrix,
//     [1, 0, 0, 1, -this.pathOffset.x, -this.pathOffset.y],
//   );
//   const pathString = getPathScaledForTransform(this.path, matrix);
//   const multiplier = this.strokeUniform ? getStrokeMultiplier({ backgroundImage: artboard }) : 1;
//   if (!this.strokeNofill && this.hasStroke()) {
//     pdfDoc.lineWidth(this.strokeWidth * multiplier);
//     pdfDoc.path(pathString);
//     if (this.strokeDashArray && this.strokeDashArray[0] !== 0 && this.strokeDashArray[1] !== 0) {
//       pdfDoc.dash(
//         this.strokeDashArray[0] * multiplier * this.strokeWidth,
//         { space: this.strokeDashArray[1] * this.strokeWidth * multiplier });
//     }
//     pdfDoc.stroke(stroke._source.slice(0, 3));
//   }
//   if (!this.nofill && this.hasFill()) {
//     pdfDoc.path(pathString);
//     pdfDoc.fill(fill._source.slice(0, 3));
//   }
//   pdfDoc.restore();
// };

const transformPdf = (fabricObject: FabricObject, pdfDoc: any) => {
  const matrix = fabricObject.calcTransformMatrix();
  pdfDoc.transform(...matrix);
};

const addImageToPdfKit = async (fabricImage: FabricImage<ImageProps>, pdfDoc: any) => {

  const arrayBuffer = await (fabricImage.originalFile as File).arrayBuffer()
  arrayBuffer.toString = () => `image-${Date.now()}}`;
  

  pdfDoc.save();
  transformPdf(fabricImage, pdfDoc);
  const originalSize = fabricImage.getOriginalSize()
  pdfDoc.image(arrayBuffer, -fabricImage.width / 2, -fabricImage.height / 2, { width: originalSize.width, height: originalSize.height });
  pdfDoc.restore();
}

export const addCanvasToPdfPage = (canvas: StaticCanvas, pdfDoc: any, box: box) => {
  // translate to position.
  // skip background color, but draw the clip region

  // draw the background that is an image
  if (canvas.backgroundImage instanceof FabricImage) {
    // parse it back to SVG and try to paint it svg like
  }
  pdfDoc.save();
  pdfDoc.transform(1, 0, 0, 1, box.x, box.y);

  const mainImage = canvas.getObjects('image')[0] as FabricImage;
  addImageToPdfKit(mainImage, pdfDoc);

  // if (canvas.overlayImage instanceof Group) {
  //   addGroupToPdf(canvas.overlayImage, pdfDoc, box);
  // }

  pdfDoc.restore();
}