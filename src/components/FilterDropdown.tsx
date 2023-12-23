import type { JSX, RefObject } from 'react';
import { useCallback, useState } from 'react';
import { classRegistry } from 'fabric';
import type { Canvas, FabricImage, filters } from 'fabric';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
}

const FilterDropdown = ({ canvasArrayRef }: FilterDropdownProps): JSX.Element => {

  const [filter, setCurrentFilter] = useState<string>('')

  const toggleFilter = useCallback((evt: SelectChangeEvent<string>) => {
    const value = evt.target.value;
    const filter = value && new (classRegistry.getClass(value));
    const canvases = canvasArrayRef.current;
    if (canvases) {
      canvases.forEach((canvas) => {
        canvas.getObjects('image').forEach((image) => {
          (image as unknown as FabricImage).filters = (filter ? [filter as filters.BaseFilter] : []);
          (image as FabricImage).applyFilters();
        });
        canvas.requestRenderAll();
      });
      setCurrentFilter(value);
    }
  }, []);


    return <FormControl size="small" sx={{ m: 1, minWidth: 120 }} >
    <InputLabel id="filter-select">Image filter</InputLabel>
    <Select
      labelId="filter-select"
      value={filter}
      label="Image filter"
      onChange={toggleFilter}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      <MenuItem value="BlackWhite">Black & white</MenuItem>
      <MenuItem value="Grayscale">Grayscale</MenuItem>
    </Select>
  </FormControl>
}

export default FilterDropdown;