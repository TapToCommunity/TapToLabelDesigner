import MUIButton from '@mui/material/Button';

export const Button = ({ classes = {}, ...otherProps }) => (
  <MUIButton {...otherProps} classes={{ ...classes, root: 'hiddenText' }} />
);
