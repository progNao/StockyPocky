"use client";

import { TextField, Typography } from "@mui/material";

type FieldInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  large?: boolean;
};

export default function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  large,
}: FieldInputProps) {
  return (
    <div>
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>

      <TextField
        fullWidth
        multiline={large}
        minRows={large ? 3 : 1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        slotProps={{
          input: {
            sx: {
              backgroundColor: "white",
              borderRadius: "20px",
              paddingY: 0.5,
            },
          },
        }}
        sx={{ marginBottom: 3 }}
      />
    </div>
  );
}
