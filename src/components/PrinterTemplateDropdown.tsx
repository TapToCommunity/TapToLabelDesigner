import type { JSX } from 'react';
import { useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { printTemplates } from '../printTemplates';
import { useAppDataContext } from '../contexts/appData';

const PrinterTemplateDropdown = (): JSX.Element => {
  const { printerTemplateKey, setPrinterTemplateKey, setPrinterTemplate } =
    useAppDataContext();
  const toggleTemplate = useCallback(
    async (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      const template = printTemplates[value];
      setPrinterTemplateKey(value);
      setPrinterTemplate(template);
    },
    [setPrinterTemplateKey, setPrinterTemplate],
  );

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="template-select" sx={{ fontWeight: 400 }}>
        Print template
      </InputLabel>
      <Select
        labelId="printer-select"
        value={printerTemplateKey}
        label="Print sheet"
        onChange={toggleTemplate}
        sx={{ fontWeight: 400 }}
      >
        {Object.entries(printTemplates).map(([key, value]) => (
          <MenuItem
            key={key}
            value={key}
            selected={key === printerTemplateKey}
            sx={{ fontWeight: 400 }}
          >
            {value.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PrinterTemplateDropdown;
