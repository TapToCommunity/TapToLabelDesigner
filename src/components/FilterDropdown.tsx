import type { JSX, RefObject, ReactEventHandler } from 'react';
import { useCallback } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { filters } from 'fabric';
import type { Canvas, FabricImage } from 'fabric';

type FilterDropdownProps = {
  canvasArrayRef: RefObject<Canvas[]>;
}

const FilterDropdown = ({ canvasArrayRef }: FilterDropdownProps): JSX.Element => {

  const toggleFilter = useCallback<ReactEventHandler<HTMLInputElement>>((evt) => {
    const BWFilter = new filters.BlackWhite();
    const filterOn = (evt.target as HTMLInputElement).checked;
    const canvases = canvasArrayRef.current;
    if (canvases) {
      canvases.forEach((canvas) => {
        canvas.getObjects('image').forEach((image) => {
          (image as unknown as FabricImage).filters = (filterOn ? [BWFilter as unknown as filters.BaseFilter] : []);
          (image as FabricImage).applyFilters();
        });
        canvas.renderAll();
      });
    }
  }, []);

  return <FormControlLabel control={<Checkbox onChange={toggleFilter} />} label="BW filter" />
}

export default FilterDropdown;