import type { JSX } from 'react';
import { useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { templateType, templates } from '../cardsTemplates';
import { useAppDataContext } from '../contexts/appData';

const stopClick = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

type TemplateDropdownProps = {
  setLocalTemplate?: (t: templateType) => void;
  localTemplate?: templateType;
  id: string;
};

const TemplateDropdown = ({
  setLocalTemplate,
  localTemplate,
  id = 'header-dropdown',
}: TemplateDropdownProps): JSX.Element => {
  const { setTemplate, template } = useAppDataContext();
  const toggleTemplate = useCallback(
    async (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      const chosenTemplate = templates[value];
      if (setLocalTemplate) {
        setLocalTemplate(chosenTemplate);
      } else {
        setTemplate(chosenTemplate);
      }
    },
    [setLocalTemplate, setTemplate],
  );

  const currentTemplate = localTemplate || template;

  const currentKey = Object.entries(templates).find(
    ([, value]) => value === currentTemplate,
  )?.[0];

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={id} htmlFor={`${id}-select`} sx={{ fontWeight: 400 }}>
        Card template
      </InputLabel>
      <Select
        id={`${id}-select`}
        labelId={id}
        label="Card template"
        value={currentKey}
        onMouseDown={stopClick}
        onClick={stopClick}
        onOpen={stopClick}
        onChange={toggleTemplate}
        sx={{ fontWeight: 400 }}
      >
        {Object.entries(templates).map(([key, value]) => (
          <MenuItem
            onClick={stopClick}
            key={key}
            value={key}
            selected={value === currentTemplate}
            sx={{ fontWeight: 400 }}
          >
            {value.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TemplateDropdown;
