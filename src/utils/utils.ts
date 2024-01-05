export const colorsDiffer = (colorsA: string[], colorsB: string[]) => 
  colorsA.some((color, index) => colorsB[index] !== color);