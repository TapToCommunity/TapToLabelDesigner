// import { Path, Group, FabricObject, FabricImage, type StaticCanvas, util } from 'fabric';
// import type { jsPDF } from'jspdf';

// const transformPdf = (fabricObject: FabricObject, pdfDoc: jsPDF) => {
//   const matrix = fabricObject.calcOwnMatrix();
//   pdfDoc.canvas.getContext().transform(...matrix);
// }

// const drawPathOnPdf = (fabricObject: Path, pdfDoc: jsPDF) => {

// }

// const drawGroupOnPdf = (pdfDoc: jsPDF, fabricObject: Group) => {
//   for (let i = 0; i < fabricObject._objects.length; i++) {
//     drawObjectOnPdf(pdfDoc, fabricObject._objects[i]);
//   }
// }

// export const drawObjectOnPdf = (pdfDoc: jsPDF, fabricObject: FabricObject) => {
//   pdfDoc.canvas.getContext().save();
//   transformPdf(pdfDoc, fabricObject);
//   if (fabricObject instanceof Path) {
//     drawPathOnPdf(pdfDoc, fabricObject)
//   }
//   if (fabricObject instanceof FabricImage) {
//     drawImageOnPdf(pdfDoc, fabricObject)
//   }
//   if (fabricObject instanceof Group) {
//     drawGroupOnPdf(pdfDoc, fabricObject)
//   }
//   pdfDoc.canvas.getContext().restore();
// }

// type box = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// const fromPixelsToPoints = (px: number): number => px / 300 * 72;

// const addPathToPdf = (path: Path, pdfDoc: jsPDF) => {
//   const pdfContext = pdfDoc.canvas.getContext();
//   pdfContext.save();

//   pdfContext.restore();
// }

// const addGroupToPdf = (group: Group, pdfDoc: jsPDF, box: box) => {
//   const pdfContext = pdfDoc.canvas.getContext();
//   pdfContext.save();
//   transformPdf(group, pdfDoc);
//   group.forEachObject((object) => {
//     if (object instanceof Path) {
//       addPathToPdf(object, pdfDoc);
//     }
//   })
//   pdfContext.restore();
// }

// const addFabricImageToPdfPage = (mainImage: FabricImage, pdfDoc: jsPDF, box: box) => {
//   const { tl, br } = mainImage.calcACoords();
//   const angle = mainImage.getTotalAngle();
//   pdfDoc.addImage(mainImage._element as HTMLImageElement, 'JPEG', fromPixelsToPoints(tl.x) + box.x, fromPixelsToPoints(tl.y) + box.y, fromPixelsToPoints(br.x - tl.x), fromPixelsToPoints(br.y - tl.y), undefined, undefined, angle);
// }

// export const addCanvasToPdfPage = (canvas: StaticCanvas, pdfDoc: jsPDF, box: box) => {
//   // translate to position.
//   // skip background color, but draw the clip region

//   // draw the background that is an image
//   if (canvas.backgroundImage instanceof FabricImage) {
//     // parse it back to SVG and try to paint it svg like
//   }
//   const pdfContext = pdfDoc.canvas.getContext();
//   pdfContext.save();
//   pdfContext.transform(1, 0, 0, 1, box.x, box.y);

//   const mainImage = canvas.getObjects('image')[0] as FabricImage;
//   addFabricImageToPdfPage(mainImage, pdfDoc, box);

//   if (canvas.overlayImage instanceof Group) {
//     addGroupToPdf(canvas.overlayImage, pdfDoc, box);
//   }

//   pdfContext.restore();
// }
