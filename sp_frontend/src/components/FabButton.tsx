"use client";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type DangerButtonProps = {
  onClick: () => void;
};

export default function FabButton({ onClick }: DangerButtonProps) {
  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 40,
        right: 30,
        backgroundColor: "#3ECF8E",
        marginBottom: 10,
      }}
    >
      <AddIcon sx={{ fontSize: 32 }} />
    </Fab>
  );
}
