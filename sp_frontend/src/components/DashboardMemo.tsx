"use client";

import { Box, Typography, Card, Stack } from "@mui/material";

type Memo = {
  id: number;
  title: string;
  is_done: boolean;
};

type Props = {
  title?: string;
  memos: Memo[];
};

export default function DashboardMemo({
  title = "今日のタスクとメモ",
  memos,
}: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {memos.length === 0 ? (
        <Typography sx={{ color: "#7A7A7A", textAlign: "center", mt: 4 }}>
          今日のタスクやメモはありません
        </Typography>
      ) : (
        <Stack spacing={1}>
          {memos.map((memo) => (
            <Card
              key={memo.id}
              sx={{
                borderRadius: 2,
                backgroundColor: memo.is_done ? "#E6F8EE" : "#FFFFFF",
                p: 2,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: memo.is_done ? "line-through" : "none",
                  color: memo.is_done ? "#6B7280" : "#154718",
                }}
              >
                {memo.title}
              </Typography>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
