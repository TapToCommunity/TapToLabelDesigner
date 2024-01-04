import type { JSX, RefObject } from 'react';
import { useCallback, useState } from 'react';
import type { Canvas } from 'fabric';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { templates, defaultTemplateKey } from '../constants';
import { setTemplateOnCanvases } from '../utils/setTemplate';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

const TemplateDropdown = ({
  canvasArrayRef,
}: FilterDropdownProps): JSX.Element => {
  const [template, setCurrentTemplate] = useState<string>(defaultTemplateKey);

  const toggleTemplate = useCallback(
    (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      const canvases = canvasArrayRef.current;
      const template = templates[value];
      if (canvases) {
        setTemplateOnCanvases(template, canvases);
      }
      setCurrentTemplate(value);
    },
    [canvasArrayRef],
  );

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
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
        {Object.entries(templates).map(([key, value]) => (
          <MenuItem value={key}>{value.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TemplateDropdown;
