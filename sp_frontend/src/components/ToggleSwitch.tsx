"use client";

import { Box, Switch, Typography } from "@mui/material";

type ToggleSwitchProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function ToggleSwitch({
  label,
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 2,
        borderRadius: "20px",
        marginBottom: 3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ fontWeight: 600 }}>{label}</Typography>

      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#32D26A",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#32D26A",
          },
        }}
      />
    </Box>
  );
}
