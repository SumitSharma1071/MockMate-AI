import Checkbox from '@mui/material/Checkbox';

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

export default function Check() {
  return (
    <>
      <Checkbox {...label} />
     </>
  );
}