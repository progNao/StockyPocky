"use client";

import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type Header = {
  title: string;
  onBackAction: () => void;
  onEditPage?: () => void;
  onFavoriteAction?: () => void;
  isFavorite?: boolean;
};

export default function Header({
  title,
  onBackAction,
  onEditPage,
  onFavoriteAction,
  isFavorite,
}: Header) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 3,
      }}
    >
      {/* 戻るボタン */}
      <IconButton onClick={onBackAction} sx={{ color: "#154718" }}>
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* タイトル */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          color: "#154718",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {title}
      </Typography>
      {onEditPage && (
        <IconButton onClick={onEditPage} sx={{ color: "#154718" }}>
          <EditIcon />
        </IconButton>
      )}
      {onFavoriteAction && (
        <IconButton
          onClick={onFavoriteAction}
          sx={{
            color: isFavorite ? "red" : "gray",
            transition: "0.2s",
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
    </Box>
  );
}
