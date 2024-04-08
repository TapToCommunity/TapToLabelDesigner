import { useFileDropperContext } from '../contexts/fileDropper';
import { useEffect } from 'react';

export const useWindowPaste = (): null => {
  const { setFiles, files } = useFileDropperContext();
  useEffect(() => {
    const eventHandler = async (evt: ClipboardEvent): Promise<void> => {
      const types = evt.clipboardData?.types;
      if (!types) {
        return;
      }
      // @ts-expect-error navigator not typed?
      const items = await Navigator.clipboard.read();
      console.log(items);
      if (types.includes('Files')) {
        console.log('includes types!');
        const img = evt.clipboardData.getData('Files');
        // setFiles([...files, img]);
        console.log(img);
      } else if (evt.clipboardData?.types.includes('text/html')) {
        const url = evt.clipboardData.getData('text/html');
        const blob = await (await fetch(url)).blob();
        setFiles([...files, new File([blob], url.split('/')?.pop() || '')]);
        console.log(url, blob);
      }
    };
    window.addEventListener('paste', eventHandler);
    return () => window.removeEventListener('paste', eventHandler);
  }, [setFiles, files]);

  return null;
};
