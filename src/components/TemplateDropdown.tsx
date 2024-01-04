import type { JSX, RefObject } from 'react';
import { useCallback } from 'react';
import type { Canvas } from 'fabric';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { templates } from '../constants';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { useAppDataContext } from '../contexts/appData';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

const TemplateDropdown = ({
  canvasArrayRef,
}: FilterDropdownProps): JSX.Element => {
  const { templateKey, setTemplate, setTemplateKey, setOriginalColors } =
    useAppDataContext();
  const toggleTemplate = useCallback(
    async (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      const canvases = canvasArrayRef.current;
      const template = templates[value];
      if (canvases) {
        const colors = await setTemplateOnCanvases(canvases, template);
        setOriginalColors(colors);
      }
      setTemplateKey(value);
      setTemplate(template);
    },
    [canvasArrayRef, setOriginalColors, setTemplate, setTemplateKey],
  );

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="template-select">Card template</InputLabel>
      <Select
        labelId="template-select"
        value={templateKey}
        label="Card template"
        onChange={toggleTemplate}
      >
        <MenuItem value="blank">
          <em>Blank</em>
        </MenuItem>
        {Object.entries(templates).map(([key, value]) => (
          <MenuItem key={key} value={key} selected={key === templateKey}>
            {value.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TemplateDropdown;
