export const colorsDiffer = (colorsA: string[], colorsB: string[]) =>
  colorsA.some((color, index) => colorsB[index] !== color);

export const noop = () => {};

export const downloadBlob = (blob: Blob, name: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  link.remove();
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
  }, 500);
}