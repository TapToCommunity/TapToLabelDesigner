// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FabricImage, type FabricObject, Group, ImageProps, Path, StaticCanvas, util, Color, Rect } from 'fabric';

// export const createDownloadStream = async (pdfDoc: any): Promise<Blob> => {
//   // @ts-expect-error yeah no definitions
//   const { default: BlobStream } = await import('blob-stream/blob-stream.js');
//   const stream = pdfDoc.pipe(new BlobStream());
//   return new Promise((resolve) => {
//     stream.on('finish', () => {
//       resolve(stream.toBlob('application/pdf'));
//     });
//   });
// }

// type box = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// const addRectToPdf = (rect: Rect, pdfDoc: any, box: box) => {
//   pdfDoc.save();
//   pdfDoc.transform(1,0,0,1, -box.width / 2 / 0.24, -box.height / 2 / 0.24);

//   transformPdf(rect, pdfDoc);

//   const fill = new Color(rect.fill as string);
//   const stroke = new Color(rect.stroke as string);

//   const paintStroke = () => {
//     if (rect.stroke && rect.stroke !== 'transparent') {
//       pdfDoc.lineWidth(rect.strokeWidth);
//       pdfDoc.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
//       // pdfDoc.strokeOpacity(this.opacity);
//       if (rect.strokeDashArray && rect.strokeDashArray[0] !== 0 && rect.strokeDashArray[1] !== 0) {
//         pdfDoc.dash(
//           rect.strokeDashArray[0]  / rect.scaleX,
//           { space: rect.strokeDashArray[1] * rect.strokeWidth });
//       }
//       pdfDoc.stroke(stroke.getSource().slice(0, 3));
//     }
//   };

//   const paintFill = () => {
//     if (rect.fill && rect.fill !== 'transparent') {
//       // pdfDoc.fillOpacity(this.opacity);
//       pdfDoc.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
//       pdfDoc.fill(fill.getSource().slice(0, 3));
//     }
//   };
//   if (rect.paintFirst === 'stroke') {
//     paintStroke();
//     paintFill();
//   } else {
//     paintFill();
//     paintStroke();
//   }
//   pdfDoc.restore();
// };

// const addPathToPdf = (path: Path, pdfDoc: any, box: box) => {
//   const fill = new Color(path.fill as string);
//   const stroke = new Color(path.stroke as string);
//   pdfDoc.save();
//   const objectMatrix = path.calcTransformMatrix();

//   pdfDoc.transform(1,0,0,1, -box.width / 2 / 0.24, -box.height / 2/ 0.24);

//   const pathString = util.transformPath(
//     path.path, objectMatrix, path.pathOffset
//   ).map(c => c.join(' ')).join(' ');

//   if (path.stroke && path.stroke !== 'transparent') {
//     pdfDoc.lineWidth(path.strokeWidth);
//     pdfDoc.path(pathString);
//     if (path.strokeDashArray && path.strokeDashArray[0] !== 0 && path.strokeDashArray[1] !== 0) {
//       pdfDoc.dash(
//         path.strokeDashArray[0] * path.strokeWidth,
//         { space: path.strokeDashArray[1] * path.strokeWidth });
//     }
//     pdfDoc.stroke(stroke.getSource().slice(0, 3));
//   }
//   if (path.fill && path.fill !== 'transparent') {
//     pdfDoc.path(pathString);
//     pdfDoc.fill(fill.getSource().slice(0, 3));
//   }
//   pdfDoc.restore();
// };

// const transformPdf = (fabricObject: FabricObject, pdfDoc: any) => {
//   const matrix = fabricObject.calcTransformMatrix();
//   pdfDoc.transform(...matrix);
// };

// const addImageToPdfKit = async (fabricImage: FabricImage<ImageProps>, pdfDoc: any) => {

//   // @ts-expect-error this isn't typed
//   const arrayBuffer = await (fabricImage.originalFile as File).arrayBuffer()
//   arrayBuffer.toString = () => `image-${Date.now()}}`;
  

//   pdfDoc.save();
//   transformPdf(fabricImage, pdfDoc);
//   const originalSize = fabricImage.getOriginalSize()
//   pdfDoc.image(arrayBuffer, -fabricImage.width / 2, -fabricImage.height / 2, { width: originalSize.width, height: originalSize.height });
//   pdfDoc.restore();
// }

// const addGroupToPdf = (group: Group, pdfDoc: any, box: box) => {
//   pdfDoc.save();
//   transformPdf(group, pdfDoc);
//   group.forEachObject((object) => {
//     if (object instanceof Path) {
//       addPathToPdf(object, pdfDoc, box);
//     }
//     if (object instanceof Rect) {
//       addRectToPdf(object, pdfDoc, box);
//     }
//   })
//   pdfDoc.restore();
// }

// export const addCanvasToPdfPage = async (canvas: StaticCanvas, pdfDoc: any, box: box) => {
//   // translate to position.
//   // skip background color, but draw the clip region

//   // draw the background that is an image
//   if (canvas.backgroundImage instanceof FabricImage) {
//     // parse it back to SVG and try to paint it svg like
//   }
//   pdfDoc.save();
//   // 0.24 is a scale factor between px and points to keep the 300dpi
//   pdfDoc.transform(0.24, 0, 0, 0.24, box.x, box.y);

//   const mainImage = canvas.getObjects('image')[0] as FabricImage;
//   await addImageToPdfKit(mainImage, pdfDoc);

//   if (canvas.overlayImage instanceof Group) {
//     addGroupToPdf(canvas.overlayImage, pdfDoc, box);
//   }

//   pdfDoc.restore();
// }