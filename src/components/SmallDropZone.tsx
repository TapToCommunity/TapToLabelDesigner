import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import { useFileDropper } from './FileDropper';
import './SmallDropZone.css';
import { useRef } from 'react';

type SmallDropZoneProps = {
  className?: string;
};

export const SmallDropZone = ({ className }: SmallDropZoneProps) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const { onDragOver } = useFileDropper({ elementRef: dropRef });
  return (
    <div
      className={`dropzone ${className}`}
      ref={dropRef}
      onDragOver={onDragOver}
    >
      <svg width="320" height="320">
        <rect
          rx="40"
          ry="40"
          width="314"
          height="314"
          x="3"
          y="3"
          strokeWidth="6"
          strokeLinecap="round"
          stroke="rgba(255, 255, 254, 0.75)"
          strokeDasharray="40"
          fill="rgba(255, 255, 254, 0.15)"
        />
      </svg>
      <div className="theIcon">
        <AddCircleOutlineIcon
          sx={{ width: '48px', height: '48px', marginBottom: '12px' }}
        />
        <Typography>
          Drag images here
          <br /> or browse
        </Typography>
      </div>
    </div>
  );
};
