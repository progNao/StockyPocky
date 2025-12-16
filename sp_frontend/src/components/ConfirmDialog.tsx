"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "normal" | "danger";
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText = "キャンセル",
  variant = "normal",
  onConfirm,
  onClose,
}: Props) {
  const isDanger = variant === "danger";

  const theme = {
    icon: isDanger ? (
      <WarningAmberIcon sx={{ fontSize: 48, color: "#F44336", mb: 1 }} />
    ) : (
      <CheckCircleIcon sx={{ fontSize: 48, color: "#32D26A", mb: 1 }} />
    ),
    titleColor: isDanger ? "#B71C1C" : "#154718",
    confirmBg: isDanger ? "#F44336" : "#32D26A",
    confirmHover: isDanger ? "#D32F2F" : "#29C05F",
    confirmShadow: isDanger
      ? "0 6px 14px rgba(244,67,54,0.4)"
      : "0 6px 14px rgba(50,210,106,0.4)",
    confirmText: confirmText ?? (isDanger ? "削除する" : "OK"),
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          paddingY: 2,
        },
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: "center", px: 2 }}>
          {theme.icon}

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1, color: theme.titleColor }}
          >
            {title ?? (isDanger ? "削除確認" : "確認")}
          </Typography>

          <Typography
            sx={{
              color: "#555",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: "30px",
            borderColor: "#DDD",
            color: "#666",
            fontWeight: 600,
          }}
        >
          {cancelText}
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          sx={{
            borderRadius: "30px",
            backgroundColor: theme.confirmBg,
            fontWeight: 700,
            boxShadow: theme.confirmShadow,
            "&:hover": {
              backgroundColor: theme.confirmHover,
            },
          }}
        >
          {theme.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
