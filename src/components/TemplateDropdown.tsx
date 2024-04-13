import type { JSX } from 'react';
import { useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { templateType, templates } from '../cardsTemplates';
import { useAppDataContext } from '../contexts/appData';

type TemplateDropdownProps = {
  setLocalTemplate?: (t: templateType) => void;
  localTemplate?: templateType;
};

const TemplateDropdown = ({
  setLocalTemplate,
  localTemplate,
}: TemplateDropdownProps): JSX.Element => {
  const { setTemplate, template } = useAppDataContext();
  const toggleTemplate = useCallback(
    async (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      const chosenTemplate = templates[value];
      console.log('executing', chosenTemplate, setLocalTemplate);
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
      <InputLabel id="template-select" sx={{ fontWeight: 400 }}>
        Card template
      </InputLabel>
      <Select
        labelId="template-select"
        label="Card template"
        value={currentKey}
        onChange={toggleTemplate}
        sx={{ fontWeight: 400 }}
      >
        {Object.entries(templates).map(([key, value]) => (
          <MenuItem
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
