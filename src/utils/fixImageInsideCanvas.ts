import { Point, type TOriginX, type TOriginY, type FabricImage } from "fabric";

export const fixImageInsideCanvas = (target: FabricImage) => {
  const { canvas } = target;
  // constrain image position
  const center = target.getRelativeCenterPoint();
  let fixOriginX: TOriginX = 'center';
  let fixOriginY: TOriginY = 'center';
  let fixXPos = center.x;
  let fixYPos = center.y;
  // top left corner
  const topLeft = target.translateToOriginPoint(
    center,
    'left',
    'top',
  );
  if (topLeft.x > 0) {
    fixXPos = 0;
    fixOriginX = 'left';
  }
  if (topLeft.y > 0) {
    fixYPos = 0;
    fixOriginY = 'top';
  }

  // bottom left corner
  // max y and max x depends on currenct canvas size and zoom
  const maxY = canvas!.height / canvas!.getZoom();
  const maxX = canvas!.width / canvas!.getZoom();
  const bottomRight = target.translateToOriginPoint(
    center,
    'right',
    'bottom',
  );
  if (bottomRight.x < maxX) {
    fixXPos = maxX;
    fixOriginX = 'right';
  }
  if (bottomRight.y < maxY) {
    fixYPos = maxY;
    fixOriginY = 'bottom';
  }
  target.setPositionByOrigin(
    new Point(fixXPos, fixYPos),
    fixOriginX,
    fixOriginY,
  );
}