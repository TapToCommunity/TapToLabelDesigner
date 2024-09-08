import {
  addCanvasToPdfPage,
  createDownloadStream,
} from '../extensions/fabricToPdfKit';
import { type PrintOptions } from '../contexts/appData';
import { printTemplates } from '../printTemplates';
import { type CardData } from '../contexts/fileDropper';

const fromMMtoPoint = (x: number): number => (x / 25.4) * 72;
const fromPixToPoint = (x: number): number => (x / 300) * 72;

export const preparePdf = async (
  printOptions: PrintOptions,
  cards: CardData[],
) => {
  const { printerTemplateKey, cutMarks } = printOptions;
  const printerTemplate = printTemplates[printerTemplateKey];
  const { gridSize: _tmpGridSize, leftMargin, topMargin, paperSize, columns: _tmpColumns, rows: _tmpRows, rightMargin, bottomMargin } =
    printerTemplate;


  let ptPaperSize = paperSize;
  if (Array.isArray(paperSize)) {
    ptPaperSize = (paperSize as [number, number]).map(fromMMtoPoint) as [
      number,
      number,
    ];
  }

  const { default: PDFDocument } = await import(
    'pdfkit/js/pdfkit.standalone.js'
  );
  const pdfDoc = new PDFDocument({ autoFirstPage: false });
  const downloadPromise = createDownloadStream(pdfDoc);
  const paperHeightInPt = fromMMtoPoint(paperSize[1])
  const topMarginInPt = fromMMtoPoint(topMargin);
  const paperWidthInPt = fromMMtoPoint(paperSize[0])
  const leftMarginInPt = fromMMtoPoint(leftMargin);
  const rightMarginInPt = fromMMtoPoint(rightMargin || leftMargin);
  const bottomMarginInPt = fromMMtoPoint(bottomMargin || topMargin);

  const cutHelperX = new Set();
  const cutHelperY = new Set();

  // take first card and compare with paper size, then try to guess best way to fit
  const firstCard = cards[0];
  const widthInPt = fromPixToPoint(firstCard.template!.media.width);
  const heightInPt = fromPixToPoint(firstCard.template!.media.height);
  const availWidth = paperWidthInPt - leftMarginInPt - rightMarginInPt;
  const availHeight = paperHeightInPt - topMarginInPt - bottomMarginInPt;

  let rows = _tmpRows, columns = _tmpColumns;
  let isRotated = false;
  if (!_tmpColumns && !_tmpRows) {

    // naively divide width by width and height by height, find margins and spacing.
    const possibleRows = Math.floor(availHeight / heightInPt);
    const possibleColums = Math.floor(availWidth / widthInPt);
    const straightLabels = possibleRows * possibleColums;
    const possibleRowsRotated = Math.floor(availHeight / widthInPt);
    const possibleColumsRotated = Math.floor(availWidth / heightInPt);
    console.log({ possibleRows, possibleColums, possibleRowsRotated, possibleColumsRotated, availHeight, heightInPt, availWidth, widthInPt })
    const rotatedLabels = possibleRowsRotated * possibleColumsRotated;
    if (straightLabels === rotatedLabels) {
      const marginsW = availWidth - possibleColums * widthInPt;
      const marginsH = availHeight - possibleRows * heightInPt;

      const marginsWR = availWidth - possibleColumsRotated * heightInPt;
      const marginsHR = availHeight - possibleRowsRotated * widthInPt;
      // this is bullshit. I ll think on how to choose
      if (Math.abs(marginsW - marginsH) > Math.abs(marginsWR - marginsHR)) {
        rows = possibleRowsRotated;
        columns = possibleColumsRotated;
        isRotated = true;
      } else {
        rows = possibleRows;
        columns = possibleColums;
      }
      // choose the labels with more margin
    } else if (straightLabels > rotatedLabels) {
      rows = possibleRows;
      columns = possibleColums;
    } else {
      isRotated = true;
      rows = possibleRowsRotated;
      columns = possibleColumsRotated;
    }
  }

  const gridSize = _tmpGridSize.map(x => fromMMtoPoint(x));
  if (gridSize[0] === 0) {
    // determine grid size here
    let cWidth = widthInPt;
    let cHeight = heightInPt;
    if (isRotated) {
      cWidth = heightInPt;
      cHeight = widthInPt;
    }
    gridSize[0] = cWidth;
    if (columns > 1) {
      const freeSpace = (availWidth - columns * cWidth);
      const extraMargin = freeSpace / (columns - 1);
      gridSize[0] = cWidth + extraMargin;
    }
    gridSize[1] = heightInPt;
    if (rows > 1) {
      const freeSpace = (availHeight - rows * cHeight);
      const extraMargin = freeSpace / (rows - 1);
      gridSize[1] = cHeight + extraMargin;
    }
  }

  const labelsPerPage = rows * columns;


  const makeTheCropMarks = () => {
    pdfDoc.lineWidth(0.2);
    // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
    cutHelperX.forEach((xValue) => {
      pdfDoc.moveTo(xValue, 0);
      pdfDoc.lineTo(xValue, topMarginInPt);
      pdfDoc.moveTo(xValue, paperHeightInPt - topMarginInPt - 1);
      pdfDoc.lineTo(xValue, paperHeightInPt);
    });
    // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
    cutHelperY.forEach((yValue) => {
      pdfDoc.moveTo(0, yValue);
      pdfDoc.lineTo(leftMarginInPt, yValue);
      pdfDoc.moveTo(paperWidthInPt - leftMarginInPt, yValue);
      pdfDoc.lineTo(paperWidthInPt, yValue);
    });
    pdfDoc.stroke();
    cutHelperX.clear();
    cutHelperY.clear();
  }

  if (cards) {

    let pageNumber = 0;
    pdfDoc.addPage({ margins: 0, size: ptPaperSize });
    pdfDoc.switchToPage(pageNumber);
    for (let index = 0; index < cards.length; index++) {
      const canvas = cards[index].canvas!;
      const templateMedia = cards[index].template!.media;
      const newPageNumber = Math.floor(index / labelsPerPage);
      if (newPageNumber > pageNumber) {
        // do the cropmarks
        cutMarks === 'crop' && makeTheCropMarks();
        pageNumber = newPageNumber;
        pdfDoc.addPage({ margins: 0, size: ptPaperSize });
        pdfDoc.switchToPage(pageNumber);
      }
      const column = index % columns;
      const row = Math.floor(index / columns) % rows;

      const xStart = column * gridSize[0] + leftMarginInPt;
      const yStart = row * gridSize[1] + topMarginInPt;
      const width = fromPixToPoint(templateMedia.width);
      const height = fromPixToPoint(templateMedia.height);

      if (cutMarks === 'crop' ) {
        cutHelperX.add(xStart);
        cutHelperX.add(xStart + width);
        cutHelperY.add(yStart);
        cutHelperY.add(yStart + height);
      }

      const imageNeedsRotation = cards[index].template?.layout === 'vertical';

      await addCanvasToPdfPage(
        canvas,
        pdfDoc,
        {
          x: xStart,
          y: yStart,
          width,
          height,
        },
        imageNeedsRotation,
        templateMedia,
      );
    }
  }
  cutMarks === 'crop' && makeTheCropMarks();
  pdfDoc.end();
  downloadPromise.then((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test.pdf';
    link.click();
    link.remove();
  });
};
