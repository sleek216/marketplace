import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setSelectedModule } from "redux/slices/utils";
import { setResetStoredData } from "redux/slices/storedData";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import CustomContainer from "../container";

const LandingPromotionalBannerSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: modules = [] } = useGetModule();

  const handleExploreGrocery = () => {
    // Find grocery module if available
    const groceryModule = modules?.find(
      (m) =>
        m?.module_type === "grocery" ||
        m?.module_name?.toLowerCase().includes("grocery")
    ) || modules?.[0];

    if (groceryModule) {
      if (typeof window !== "undefined") {
        localStorage.setItem("module", JSON.stringify(groceryModule));
      }
      dispatch(setResetStoredData());
      dispatch(setSelectedModule(groceryModule));
      router.push({
        pathname: "/home",
        query: { module_id: groceryModule.id },
      }).then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        width: "100%",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.3)
            : "#ffffff",
      }}
    >
      <CustomContainer>
        <Box
          sx={{
            width: "100%",
            borderRadius: "4px",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: { xs: "auto", md: "320px" },
            boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Left Content Area (Magenta / Burgundy Background) */}
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              backgroundColor: "#8A0038",
              p: { xs: 4, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              color: "#ffffff",
            }}
          >
            <Stack spacing={2.5} sx={{ maxWidth: "380px" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.25,
                  letterSpacing: "-0.5px",
                }}
              >
                Your Everyday Grocery Needs in One Place
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                From fresh produce to pantry staples, delivered fast
              </Typography>

              <Box pt={1}>
                <Button
                  onClick={handleExploreGrocery}
                  disableElevation
                  variant="contained"
                  sx={{
                    backgroundColor: "#A3E635",
                    color: "#0F172A",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    px: 3,
                    py: 1.2,
                    borderRadius: "10px",
                    textTransform: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0px 4px 14px rgba(163, 230, 53, 0.35)",
                    "&:hover": {
                      backgroundColor: "#86EFAC",
                      transform: "translateY(-2px)",
                      boxShadow: "0px 6px 20px rgba(163, 230, 53, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Explore Now <NorthEastIcon sx={{ fontSize: 18 }} />
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Right Image Area */}
          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              minHeight: { xs: "240px", sm: "300px", md: "100%" },
              backgroundImage: `url('/static/grocery_banner.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          />
        </Box>
      </CustomContainer>
    </Box>
  );
};

export default LandingPromotionalBannerSection;
