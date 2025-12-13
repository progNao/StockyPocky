"use client";

import { Box, Chip } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type Category = {
  id: number;
  name: string;
};

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  filter: string;
  onSelectCategory: (category: Category | null) => void;
  onChangeFilter: (filter: string) => void;
  CategoryIcon: React.ElementType;
};

export default function ItemFilterChips({
  categories,
  selectedCategoryId,
  filter,
  onSelectCategory,
  onChangeFilter,
  CategoryIcon,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        marginBottom: 3,
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingBottom: 1,
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#CDEFD9",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      {/* カテゴリ */}
      {categories.map((cat) => {
        const selected = selectedCategoryId === cat.id;

        return (
          <Chip
            key={cat.id}
            icon={
              <CategoryIcon sx={{ color: selected ? "white" : "#32D26A" }} />
            }
            label={cat.name}
            onClick={() => {
              onChangeFilter(selected ? "all" : "category");
              onSelectCategory(selected ? null : cat);
            }}
            sx={{
              height: 36,
              fontSize: 14,
              fontWeight: 700,
              borderRadius: "18px",
              paddingX: 1,
              backgroundColor: selected ? "#32D26A" : "#ffffff",
              color: selected ? "white" : "#333",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              "& .MuiChip-icon": {
                color: selected ? "white" : "#32D26A",
              },
            }}
          />
        );
      })}

      {/* 低在庫 */}
      <Chip
        icon={
          <Inventory2Icon
            sx={{ color: filter === "low" ? "white" : "#32D26A" }}
          />
        }
        label="低在庫"
        onClick={() => onChangeFilter(filter === "low" ? "all" : "low")}
        sx={{
          height: 40,
          fontSize: 15,
          fontWeight: 700,
          borderRadius: "20px",
          paddingX: 1,
          backgroundColor: filter === "low" ? "#32D26A" : "#ffffff",
          color: filter === "low" ? "white" : "#333",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          "& .MuiChip-icon": {
            color: filter === "low" ? "white" : "#32D26A",
          },
        }}
      />

      {/* お気に入り */}
      <Chip
        icon={
          <FavoriteBorderIcon
            sx={{ color: filter === "favorite" ? "white" : "#32D26A" }}
          />
        }
        label="お気に入り"
        onClick={() =>
          onChangeFilter(filter === "favorite" ? "all" : "favorite")
        }
        sx={{
          height: 40,
          fontSize: 15,
          fontWeight: 700,
          borderRadius: "20px",
          paddingX: 1,
          backgroundColor: filter === "favorite" ? "#32D26A" : "#ffffff",
          color: filter === "favorite" ? "white" : "#333",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          "& .MuiChip-icon": {
            color: filter === "favorite" ? "white" : "#32D26A",
          },
        }}
      />
    </Box>
  );
}
