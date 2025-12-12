"use client";

import { Box, TextField, Typography } from "@mui/material";

type ShoppingRecordEditProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

export default function ShoppingRecordEditComponent({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: ShoppingRecordEditProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: 16, mt: 2 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}
