/* eslint-disable @next/next/no-img-element */
"use client";

import { Box, Button } from "@mui/material";

type Props = {
  label?: string;
  previewUrl?: string | null;
  onChange: (file: File) => void;
};

export default function ImagePicker({
  label = "画像を選択する",
  previewUrl,
  onChange,
}: Props) {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Button
        variant="contained"
        component="label"
        sx={{
          backgroundColor: "#32D26A",
          borderRadius: "20px",
          fontWeight: 700,
          paddingY: 1.5,
          "&:hover": {
            backgroundColor: "#29C05F",
          },
        }}
      >
        {label}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file);
            }
          }}
        />
      </Button>

      {previewUrl && (
        <Box
          sx={{
            marginTop: 2,
            width: 200,
            height: 200,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            mx: "auto",
          }}
        >
          <img
            src={previewUrl}
            alt="preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
