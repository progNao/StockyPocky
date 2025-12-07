import {
  Inventory2,
  ShoppingCart,
  Description,
  Home,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderTopLeftRadius: "28px",
        borderTopRightRadius: "28px",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
        paddingTop: 2,
        paddingBottom: 3,
        zIndex: 1000,
      }}
    >
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        sx={{ position: "relative" }}
      >
        {/* ホーム */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/dashboard")}
          >
            <Home sx={{ color: "#32D26A", fontSize: 28 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#32D26A",
                mt: 0.5,
              }}
            >
              ホーム
            </Typography>
          </Box>
        </Grid>

        {/* 在庫 */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/inventory")}
          >
            <Inventory2 sx={{ color: "#7A7A7A", fontSize: 28 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#7A7A7A",
                mt: 0.5,
              }}
            >
              在庫
            </Typography>
          </Box>
        </Grid>

        {/* リスト */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/shopping-list")}
          >
            <ShoppingCart sx={{ color: "#7A7A7A", fontSize: 28 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#7A7A7A",
                mt: 0.5,
              }}
            >
              リスト
            </Typography>
          </Box>
        </Grid>

        {/* 分析 */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/analysis")}
          >
            <Description sx={{ color: "#7A7A7A", fontSize: 28 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#7A7A7A",
                mt: 0.5,
              }}
            >
              メモ
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
