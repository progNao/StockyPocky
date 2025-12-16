"use client";

import { ShoppingRecordDisplay } from "@/app/types";
import { useShoppingRecordStoreStore } from "@/stores/shoppingRecord";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type ShoppingRecordCardProps = {
  title: string;
  list: ShoppingRecordDisplay[];
};

export default function ShoppingRecordCard({
  title,
  list,
}: ShoppingRecordCardProps) {
  if (list.length === 0) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontSize: 16,
          fontWeight: 700,
          mt: 2,
          mb: 1,
        }}
      >
        {title}
      </Box>

      {list.map((item) => (
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
            fontWeight: 700,
            mt: 2,
            mb: 1,
          }}
        >
          <CardMedia
            component="img"
            image={item.image_url}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
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
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
              {item.name}
            </Typography>
            <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
              数量: {item.quantity} / 合計金額: ¥{item.price * item.quantity}
            </Typography>
          </CardContent>

          {/* 詳細画面 */}
          <IconButton
            onClick={() => {
              useShoppingRecordStoreStore.getState().setSelectedItem(item);
              router.push(`/shopping-record/${item.id}`);
            }}
            sx={{ color: "#B7B7B7" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Card>
      ))}
    </>
  );
}
