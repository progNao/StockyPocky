"use client";

import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type CountBoxProps = {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
};

export default function CountBox({ label, value, onChange }: CountBoxProps) {
  const handleChange = (delta: number) => {
    const next = value + delta;
    if (next < 0) return;
    onChange(next);
  };

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
      <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>{label}</Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-end",
        }}
      >
        <IconButton
          onClick={() => handleChange(-1)}
          sx={{
            backgroundColor: "#E9F9ED",
            color: "#1A7F3B",
            marginRight: 4,
          }}
        >
          <RemoveIcon />
        </IconButton>

        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{value}</Typography>

        <IconButton
          onClick={() => handleChange(1)}
          sx={{
            backgroundColor: "#32D26A",
            color: "#FFFFFF",
            marginLeft: 4,
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
