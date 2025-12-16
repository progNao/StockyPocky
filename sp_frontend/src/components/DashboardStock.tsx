"use client";

import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

type Item = {
  id: number;
  name: string;
  categoryName: string;
  stockQuantity: number;
  threshold: number;
  imageUrl?: string;
};

type Props = {
  title?: string;
  items: Item[];
  isLowStock: (stock: number, threshold: number) => boolean;
};

export default function DashboardStock({
  title = "在庫不足のアイテム",
  items,
  isLowStock,
}: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            在庫不足のアイテムはありません
          </Typography>
        ) : (
          items.map((item) => {
            const low = isLowStock(item.stockQuantity, item.threshold);

            return (
              <Card
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "16px",
                  padding: 1.5,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                  border: low ? "3px solid #FBBF24" : "none",
                  minHeight: 70,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.imageUrl || "/no-image.png"}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    padding: "8px 0 8px 12px",
                    "&:last-child": { paddingBottom: "8px" },
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, color: "#4A9160", lineHeight: 1.2 }}
                  >
                    {item.categoryName}
                  </Typography>

                  <Typography
                    sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {item.name}
                  </Typography>

                  <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                    在庫数：{item.stockQuantity}
                    {low && (
                      <Box
                        component="span"
                        sx={{
                          color: "#D97706",
                          fontWeight: "bold",
                          ml: 0.5,
                        }}
                      >
                        （残りわずか）
                      </Box>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
}
