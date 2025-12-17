"use client";

import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

type ShoppingItem = {
  id: number;
  name: string;
  quantity: number;
  added_at: string;
  image_url?: string;
  notes?: string | null;
};

type Props = {
  title?: string;
  items: ShoppingItem[];
  formatDate: (date: string) => string;
};

export default function DashboardShoppingList({
  title = "買い物リスト",
  items,
  formatDate,
}: Props) {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.length === 0 ? (
          <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
            買い物リストのアイテムはありません
          </Typography>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "16px",
                padding: 1.5,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                minHeight: 70,
              }}
            >
              {/* 画像 */}
              <CardMedia
                component="img"
                image={item.image_url || "/no-image.png"}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />

              {/* 名称 + 購入数 + 日付 */}
              <CardContent
                sx={{
                  flex: 1,
                  padding: "8px 0 8px 12px",
                  "&:last-child": { paddingBottom: "8px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}
                >
                  {item.name}
                </Typography>

                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  購入数：{item.quantity}
                </Typography>

                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  {formatDate(item.added_at)}
                </Typography>
              </CardContent>

              {/* メモ */}
              <Box
                sx={{
                  minWidth: 120,
                  paddingLeft: 1,
                  paddingRight: 1.5,
                  display: "flex",
                  alignItems: "center",
                  border: item.notes ? "1px solid #00000020" : "none",
                  borderRadius: "6px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#555",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {item.notes || ""}
                </Typography>
              </Box>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
