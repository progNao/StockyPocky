"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

type SelectActionProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function SelectAction({
  label,
  value,
  onChange,
}: SelectActionProps) {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontSize: 16 }}>
          {label}
          <span style={{ color: "red" }}> *</span>
        </Typography>
      </Box>

      <FormControl fullWidth>
        <InputLabel id="action-label">{label}</InputLabel>
        <Select
          labelId="action-label"
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value="increase">増加</MenuItem>
          <MenuItem value="decrease">減少</MenuItem>
          <MenuItem value="manual">マニュアル</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
