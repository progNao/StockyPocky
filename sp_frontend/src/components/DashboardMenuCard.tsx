"use client";

import { ShoppingCart } from "@mui/icons-material";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";

export default function DashboardMenuCard() {
  const router = useRouter();

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 4 }} textAlign="center">
        <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => router.push("/shopping-record")}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(50,210,106,0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <HistoryIcon fontSize="large" sx={{ color: "#32D26A" }} />
            </Box>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 9 }}>購入履歴</Typography>
        </Card>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => router.push("/item")}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(50,210,106,0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ListAltIcon fontSize="large" sx={{ color: "#32D26A" }} />
            </Box>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 9 }}>アイテムリスト</Typography>
        </Card>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Card sx={{ borderRadius: 2, p: 2, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => router.push("/shopping-list")}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                backgroundColor: "rgba(50,210,106,0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ShoppingCart fontSize="large" sx={{ color: "#32D26A" }} />
            </Box>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 9 }}>買い物リスト</Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
