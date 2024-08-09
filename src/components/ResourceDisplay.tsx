import { type FabricObject } from 'fabric';
import { type TemplateEdit } from '../resourcesTypedef';
import { Typography } from '@mui/material';
import './ResourceDisplay.css';

type ResourceDisplayProps = {
  resource?: TemplateEdit;
  target?: FabricObject;
  className: string;
};

export const ResourceDisplay = ({
  resource,
  target,
  className,
}: ResourceDisplayProps) => {
  if (!resource) {
    return null;
  }
  return (
    <div className={className}>
      {resource.resource.data.map(({ label, value }) => {
        return (
          <div className="resourceItem">
            <img src={value} />
            <Typography>{label}</Typography>
          </div>
        );
      })}
    </div>
  );
};
