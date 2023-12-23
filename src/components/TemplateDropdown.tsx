import type { JSX, RefObject } from 'react';
import { useCallback, useState } from 'react';
import type { Canvas } from 'fabric';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
}

const TemplateDropdown = ({ canvasArrayRef }: FilterDropdownProps): JSX.Element => {

  const [template, setCurrentTemplate] = useState<string>('blank')

  const toggleTemplate = useCallback((evt: SelectChangeEvent<string>) => {
    const value = evt.target.value;
    const canvases = canvasArrayRef.current;
    if (canvases) {
      canvases.forEach((canvas) => {
        canvas.requestRenderAll();
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
      <MenuItem value="BlackWhite">Black & white</MenuItem>
      <MenuItem value="Grayscale">Grayscale</MenuItem>
    </Select>
  </FormControl>
}

export default TemplateDropdown;