import {
  ShoppingCart,
  Description,
  Home,
  Settings,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import ListAltIcon from "@mui/icons-material/ListAlt";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname(); // ← これで現在のパスが分かる

  const isActive = (path: string) => pathname === path;

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
      <Grid container justifyContent="space-around" alignItems="center">
        {/* ホーム */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/dashboard")}
          >
            <Home
              sx={{
                color: isActive("/dashboard") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/dashboard") ? "#32D26A" : "#7A7A7A",
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
            onClick={() => router.push("/item")}
          >
            <ListAltIcon
              sx={{
                color: isActive("/item") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/item") ? "#32D26A" : "#7A7A7A",
                mt: 0.5,
              }}
            >
              アイテム
            </Typography>
          </Box>
        </Grid>

        {/* リスト */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/shopping-list")}
          >
            <ShoppingCart
              sx={{
                color: isActive("/shopping-list") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/shopping-list") ? "#32D26A" : "#7A7A7A",
                mt: 0.5,
              }}
            >
              リスト
            </Typography>
          </Box>
        </Grid>

        {/* メモ（分析） */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/analysis")}
          >
            <Description
              sx={{
                color: isActive("/analysis") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/analysis") ? "#32D26A" : "#7A7A7A",
                mt: 0.5,
              }}
            >
              メモ
            </Typography>
          </Box>
        </Grid>

        {/* 設定 */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/settings")}
          >
            <Settings
              sx={{
                color: isActive("/settings") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/settings") ? "#32D26A" : "#7A7A7A",
                mt: 0.5,
              }}
            >
              設定
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
