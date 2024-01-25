// import type { RefObject } from 'react';
// import type { templateType } from '../cardsTemplates';
// import type { PrintTemplate } from '../printTemplates';
// import type { Canvas } from 'fabric';
// import { addCanvasToPdfPage } from '../extensions/fabricJsToJspdf';

// const toPointsFromMM = (x: number): number => x / 25.4 * 72;

// export const preparePdf = async (printerTemplate: PrintTemplate, template: templateType, canvasArrayRef: RefObject<Canvas[]>) => {
//   const {
//     gridSize,
//     leftMargin,
//     topMargin,
//     layout,
//     paperSize,
//     columns,
//     rows,
//   } = printerTemplate;

//   const labelsPerPage = rows * columns;

//   const imageNeedsRotation = template.layout === 'vertical';

//   import('../../deps/pdfkit').then((mod) => {
//     console.log(mod);
//     const startingDoc = new jsPDF({
//       orientation: layout,
//       unit: 'pt',
//       format: paperSize,
//       putOnlyUsedFonts: true,
//       floatPrecision: 16, // or "smart", default is 16
//     });
//     startingDoc.advancedAPI((doc) => {
//       const canvases = canvasArrayRef.current;
//       if (canvases) {
//         let pageNumber = 0;
//         canvases.map((canvas, index) => {
//           const newPageNumber = Math.floor(index / labelsPerPage);
//           if (newPageNumber > pageNumber) {
//             doc.addPage(paperSize, layout);
//             pageNumber = newPageNumber;
//           }
//           const column = index % columns;
//           const row = Math.floor(index / columns) % rows;
        
//           addCanvasToPdfPage(canvas, doc, {
//             x: toPointsFromMM(column * gridSize[0] + leftMargin),
//             y: toPointsFromMM(row * gridSize[1] + topMargin),
//             width: toPointsFromMM(85),
//             height: toPointsFromMM(54),
//           });
//         });
//       }
//     });
//     startingDoc.save(`tapto-a4-${new Date().getTime()}.pdf`);
//   });
// }