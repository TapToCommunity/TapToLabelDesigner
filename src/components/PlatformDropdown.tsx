import type { JSX } from 'react';
import { useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Platform } from '../gamesDbPlatforms';

type PlatformDropdownProps = {
  platforms: Record<string, Platform>;
  setPlatform: (p: Platform) => void;
  platform: Platform;
};

export const PlatformDropdown = ({
  platforms,
  setPlatform,
  platform,
}: PlatformDropdownProps): JSX.Element => {
  const togglePlatform = useCallback(
    async (evt: SelectChangeEvent<string>) => {
      const value = evt.target.value;
      setPlatform(platforms[value]);
    },
    [platforms, setPlatform],
  );
  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="platform-select" sx={{ fontWeight: 400 }}>
        Platform
      </InputLabel>
      <Select
        labelId="platform-select"
        value={platform.id.toString()}
        label="Platform"
        onChange={togglePlatform}
        sx={{ fontWeight: 400 }}
      >
        {Object.entries(platforms).map(([key, value]) => (
          <MenuItem
            key={key}
            value={key}
            selected={key === platform.id.toString()}
            sx={{ fontWeight: 400 }}
          >
            {value.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlatformDropdown;
