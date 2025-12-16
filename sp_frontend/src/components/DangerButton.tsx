"use client";

import { Button, CircularProgress } from "@mui/material";

type DangerButtonProps = {
  label: string;
  onClick: () => void;
  loading?: boolean;
};

export default function DangerButton({
  label,
  onClick,
  loading = false,
}: DangerButtonProps) {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        backgroundColor: "#FF6B6B",
        paddingY: 2,
        borderRadius: "40px",
        fontWeight: 700,
        fontSize: "18px",
        color: "#ffffff",
        boxShadow: "0 8px 16px rgba(255, 107, 107, 0.4)",
        transition: "0.2s",
        "&:hover": {
          backgroundColor: "#FF5A5A",
          boxShadow: "0 6px 12px rgba(255, 107, 107, 0.6)",
        },
        "&:active": {
          backgroundColor: "#E14B4B",
        },
      }}
      onClick={onClick}
    >
      {loading ? <CircularProgress size={26} sx={{ color: "white" }} /> : label}
    </Button>
  );
}
