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
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setSelectedModule } from "redux/slices/utils";
import { setResetStoredData } from "redux/slices/storedData";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import CustomContainer from "../container";
import CustomImageContainer from "../CustomImageContainer";

const LandingDoorstepDeliveryBanner = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: modules = [] } = useGetModule();

  const handleShopNow = () => {
    const groceryModule =
      modules?.find(
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
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.8)
                : "#ffffff",
            borderRadius: "4px",
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.04)",
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 4, md: 3 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Left Column: Delivery Guy Image */}
          <Box
            sx={{
              width: { xs: "100%", md: "28%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "280px",
                height: { xs: "200px", sm: "240px", md: "260px" },
                position: "relative",
              }}
            >
              <CustomImageContainer
                src="/static/delivery_guy.png"
                alt="Delivery Guy"
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </Box>
          </Box>

          {/* Middle Column: Text Content & Action Button */}
          <Box
            sx={{
              width: { xs: "100%", md: "46%" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.25rem" },
                  fontWeight: 800,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : "#064E3B",
                  lineHeight: 1.25,
                  letterSpacing: "-0.4px",
                }}
              >
                Groceries Delivery at your door step
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  color: (theme) => alpha(theme.palette.neutral[500], 0.85),
                  lineHeight: 1.55,
                  maxWidth: "460px",
                }}
              >
                Fresh groceries and daily essentials delivered straight to your doorstep with care
              </Typography>

              <Box pt={1}>
                <Button
                  onClick={handleShopNow}
                  disableElevation
                  variant="contained"
                  sx={{
                    backgroundColor: "#064E3B",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    px: 3,
                    py: 1.1,
                    borderRadius: "10px",
                    textTransform: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0px 4px 14px rgba(6, 78, 59, 0.25)",
                    "&:hover": {
                      backgroundColor: "#047857",
                      transform: "translateY(-2px)",
                      boxShadow: "0px 6px 20px rgba(6, 78, 59, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Shop Now <NorthEastIcon sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Right Column: Rotating Circular Stamp Badge */}
          <Box
            sx={{
              width: { xs: "100%", md: "26%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Spinning Circular SVG Text */}
              <Box
                component="svg"
                viewBox="0 0 140 140"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  animation: "spin 16s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <path
                  id="circlePath"
                  d="M 70, 70 m -52, 0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                  fill="none"
                />
                <text
                  fill="#064E3B"
                  fontSize="9.5"
                  fontWeight="700"
                  letterSpacing="2.2"
                >
                  <textPath href="#circlePath" startOffset="0%">
                    SAME DAY DELIVERY • SAME DAY DELIVERY •
                  </textPath>
                </text>
              </Box>

              {/* Center Dark Circle with Delivery Truck */}
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: "#064E3B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#A3E635",
                  boxShadow: "0px 6px 16px rgba(6, 78, 59, 0.3)",
                  zIndex: 2,
                }}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomContainer>
    </Box>
  );
};

export default LandingDoorstepDeliveryBanner;
