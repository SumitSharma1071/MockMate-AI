import Button from '@mui/material/Button';

export default function Btn({
  variant = "contained",
  color = "primary",
  fnc,
  className = "",
  width,
  type = "button",
  onClick
}) {
  return (
    <Button
      variant={variant}
      color={color}
      type={type}
      onClick={onClick}
      className={`w-full ${
        width === "full"
          ? "sm:w-full"
          : width === "half"
          ? "sm:w-1/2"
          : "sm:w-auto"
      } ${className}`}
      style={{ minWidth: '120px' }}
    >
      {fnc}
    </Button>
  );
}