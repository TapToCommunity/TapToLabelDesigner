import type { JSX, RefObject } from 'react';
import { useCallback, useState } from 'react';
import type { Canvas } from 'fabric';
import { FabricImage, util, Point } from 'fabric';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { templates, cardLikeOptions } from '../constants';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
}

const TemplateDropdown = ({ canvasArrayRef }: FilterDropdownProps): JSX.Element => {

  const [template, setCurrentTemplate] = useState<string>('blank')

  const toggleTemplate = useCallback((evt: SelectChangeEvent<string>) => {
    const value = evt.target.value;
    const canvases = canvasArrayRef.current;
    const template = templates[value];
    if (canvases) {
      const { overlay, background } = template || {};
      Promise.all([
        overlay && util.loadImage(overlay.url),
        background && util.loadImage(background.url),
      ]).then(([overlayImageElement, backgroundImageElement]) => {
        canvases.forEach((canvas) => {
          const mainImage = canvas.getObjects('image')[0];
          if (overlayImageElement) {
            const scale = util.findScaleToCover(overlayImageElement, cardLikeOptions);
            const overlayImg = new FabricImage(overlayImageElement, {
              canvas,
              scaleX: scale,
              scaleY: scale,
            });
            canvas.overlayImage = overlayImg;
            canvas.viewportCenterObject(overlayImg);
            const pictureScale = util.findScaleToCover(mainImage, {
              width: cardLikeOptions.width * overlay!.width,
              height: cardLikeOptions.height * overlay!.height,
            });
            mainImage.set({
              scaleX: pictureScale,
              scaleY: pictureScale,
            })
            const templatePostion = overlayImg.translateToGivenOrigin(overlayImg.getRelativeXY(), 'center', 'center', 'left', 'top');
            mainImage.setPositionByOrigin(new Point(
              cardLikeOptions.width * overlay!.x + templatePostion.x,
              cardLikeOptions.height * overlay!.y + templatePostion.y,
            ), 'left', 'top');
          } else {
            // reset to BLANK
            canvas.overlayImage = undefined;
            const pictureScale = util.findScaleToCover(mainImage, cardLikeOptions);
            mainImage.set({
              scaleX: pictureScale,
              scaleY: pictureScale,
            })
            mainImage.setPositionByOrigin(new Point(0, 0), 'left', 'top');
          }
          if (backgroundImageElement) {
            const scale = util.findScaleToCover(backgroundImageElement, cardLikeOptions);
            const backgroundImg = new FabricImage(backgroundImageElement, {
              canvas,
              scaleX: scale,
              scaleY: scale,
            });
            canvas.backgroundImage = backgroundImg;
            canvas.viewportCenterObject(backgroundImg);
          } else {
            canvas.backgroundImage = canvas.clipPath;
          }
          canvas.requestRenderAll();
        });
      });
      setCurrentTemplate(value);
    }
  }, [canvasArrayRef]);


    return <FormControl size="small" sx={{ m: 1, minWidth: 120 }} >
    <InputLabel id="template-select">Card template</InputLabel>
    <Select
      labelId="template-select"
      value={template}
      label="Card template"
      onChange={toggleTemplate}
    >
      <MenuItem value="blank">
        <em>Blank</em>
      </MenuItem>
      {Object.entries(templates).map(([key, value]) => <MenuItem value={key}>{value.label}</MenuItem>)}
    </Select>
  </FormControl>
}

export default TemplateDropdown;