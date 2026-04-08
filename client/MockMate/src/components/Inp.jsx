import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Inp({label, type, required, width, maxWidth, color, name, value, onchange}) {
  return (
    <Box sx={{ width: {width}, maxWidth:{maxWidth} }}>
      <TextField 
          fullWidth 
          label={label} 
          type={type} 
          required={required} 
          color={color} 
          name={name} 
          value={value} 
          onChange={onchange}
      />
    </Box>
  );
}