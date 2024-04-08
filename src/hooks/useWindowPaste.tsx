import { useFileDropperContext } from '../contexts/fileDropper';
import { useEffect } from 'react';

export const useWindowPaste = (): null => {
  const { setFiles, files } = useFileDropperContext();
  useEffect(() => {
    const eventHandler = async (): Promise<void> => {
      if (!navigator.clipboard) {
        return;
      }
      const items = await navigator.clipboard.read();
      items.forEach(async (item) => {
        const { types } = item;
        if (types.includes('image/png')) {
          const data = await item.getType('image/png');
          setFiles([...files, new File([data], `fromclip_${Date.now()}`)]);
        } else if (types.includes('image/jpeg')) {
          const data = await item.getType('image/jpeg');
          setFiles([...files, new File([data], `fromclip_${Date.now()}`)]);
        }
      });
    };
    window.addEventListener('paste', eventHandler);
    return () => window.removeEventListener('paste', eventHandler);
  }, [setFiles, files]);

  return null;
};
