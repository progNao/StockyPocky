"use client";

import { Button, CircularProgress } from "@mui/material";

type PrimaryButtonProps = {
  label: string;
  onClick: () => void;
  loading?: boolean;
};

export default function PrimaryButton({
  label,
  onClick,
  loading = false,
}: PrimaryButtonProps) {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        backgroundColor: "#32D26A",
        paddingY: 2,
        borderRadius: "40px",
        fontWeight: 700,
        fontSize: "18px",
        color: "#FFFFFF",
        boxShadow: "0 8px 16px rgba(50,210,106,0.4)",
        "&:hover": {
          backgroundColor: "#29C05F",
        },
        marginBottom: 3,
      }}
      onClick={onClick}
    >
      {loading ? <CircularProgress size={26} sx={{ color: "white" }} /> : label}
    </Button>
  );
}
