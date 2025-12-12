"use client";

import { MenuItem, TextField, Typography } from "@mui/material";

type Option = {
  id: number;
  name: string;
};

type SelectFieldInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  options: Option[];
};

export default function SelectFieldInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  options,
}: SelectFieldInputProps) {
  return (
    <div>
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>
      <TextField
        select
        fullWidth
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
      >
        {options.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
