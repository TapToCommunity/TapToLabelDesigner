import { Path, Group, FabricObject, FabricImage } from 'fabric';
import type { jsPDF } from'jspdf';

const transformPdf = (pdfDoc: jsPDF, fabricObject: FabricObject) => {
  const matrix = fabricObject.calcOwnMatrix();
  pdfDoc.canvas.getContext().transform(...matrix);
}

const drawPathOnPdf = (pdfDoc: jsPDF, fabricObject: Path) => {

}

const drawImageOnPdf = (pdfDoc: jsPDF, fabricObject: FabricImage) => {
  pdfDoc.addImage(
    fabricObject._element as HTMLImageElement,
    'PNG',
    column * gridSize[0] + leftMargin,
    row * gridSize[1] + topMargin,
    85.5,
    54,
  )
}

const drawGroupOnPdf = (pdfDoc: jsPDF, fabricObject: Group) => {
  for (let i = 0; i < fabricObject._objects.length; i++) {
    drawObjectOnPdf(pdfDoc, fabricObject._objects[i]);
  }
}

export const drawObjectOnPdf = (pdfDoc: jsPDF, fabricObject: FabricObject) => {
  pdfDoc.canvas.getContext().save();
  transformPdf(pdfDoc, fabricObject);
  if (fabricObject instanceof Path) {
    drawPathOnPdf(pdfDoc, fabricObject)
  }
  if (fabricObject instanceof FabricImage) {
    drawImageOnPdf(pdfDoc, fabricObject)
  }
  if (fabricObject instanceof Group) {
    drawGroupOnPdf(pdfDoc, fabricObject)
  }
  pdfDoc.canvas.getContext().restore();
}




