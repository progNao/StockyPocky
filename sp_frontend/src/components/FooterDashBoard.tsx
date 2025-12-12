import {
  Add,
  ShoppingCart,
  Description,
  Home,
} from "@mui/icons-material";
import { Box, Grid, Typography, Fab } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import ListAltIcon from "@mui/icons-material/ListAlt";

export default function FooterDashBoard() {
  const router = useRouter();
  const pathname = usePathname();

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

        {/* 中央の丸ボタン */}
        <Grid>
          <Fab
            onClick={() => router.push("/item/new")}
            sx={{
              backgroundColor: "#32D26A",
              color: "#FFFFFF",
              width: 70,
              height: 70,
              position: "absolute",
              left: "50%",
              top: "-30px",
              transform: "translateX(-50%)",
              boxShadow: "0 8px 18px rgba(50,210,106,0.35)",
              "&:hover": { backgroundColor: "#29C05F" },
            }}
          >
            <Add sx={{ fontSize: 34 }} />
          </Fab>
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

        {/* 分析 */}
        <Grid>
          <Box
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push("/memo")}
          >
            <Description
              sx={{
                color: isActive("/memo") ? "#32D26A" : "#7A7A7A",
                fontSize: 28,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive("/memo") ? "#32D26A" : "#7A7A7A",
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
