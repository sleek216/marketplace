import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Fade,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useGetAllModulesCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import CustomContainer from "../../container";
import {
  categorySectionHeaderRowSx,
  headerToCategoryBandSx,
} from "components/home/homeSectionRhythm";
import {
  CategoryScrollItem,
  CategoryScrollStrip,
  scrollCategoryStrip,
  useCategoryAutoScroll,
} from "components/home/CategoryHorizontalStrip";

import promotionalBannerImg from "../../home/assets/promotional_banner.png";
import banner1 from "../../home/assets/banner.webp";
import banner2 from "../../home/assets/ecommerce_top_bg.png";
import banner3 from "../../home/assets/food.png";
import banner4 from "../../home/assets/pharmacy.png";
import banner5 from "../../home/assets/parcelBg.png";

const HeroSection = ({ landingPageDataheroSection, promotionalBanner }) => {
  const router = useRouter();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!promotionalBanner || promotionalBanner.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % promotionalBanner.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promotionalBanner]);

  const handleScroll = (direction) => {
    scrollCategoryStrip(scrollRef, direction);
  };

  const trustItems = [
    { icon: <VerifiedOutlinedIcon fontSize="small" />, label: "Verified Sellers" },
    { icon: <LocalShippingOutlinedIcon fontSize="small" />, label: "Fast Delivery" },
    { icon: <PaymentOutlinedIcon fontSize="small" />, label: "Secure Payment" },
    { icon: <SupportAgentOutlinedIcon fontSize="small" />, label: "24/7 Support" },
  ];

  // All categories across every module, straight from the backend — no static fallback.
  const { data: categoriesResponse } = useGetAllModulesCategories();
  const featuredCategories = categoriesResponse?.data || [];

  useCategoryAutoScroll(scrollRef, {
    enabled: featuredCategories.length > 1,
    intervalMs: 3000,
    pauseOnHover: true,
  });

  return (
    <Fade in={mounted} timeout={600}>
      <Box sx={{ width: "100%" }}>
        {/* ═══════════════════════════════════════════
            BOX 1: SHOP BY CATEGORY (UPPER LEVEL)
        ═══════════════════════════════════════════ */}
        <Box
          sx={{
            ...headerToCategoryBandSx,
            width: "100%",
          }}
        >
          {featuredCategories.length > 0 && (
            <Box>
              {/* Header Row */}
              <CustomContainer>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={categorySectionHeaderRowSx}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Shop by Category
                  </Typography>

                  <Stack direction="row" gap={1}>
                    <IconButton
                        onClick={() => handleScroll("left")}
                        size="small"
                        sx={{
                          border: `1.5px solid ${theme.palette.divider}`,
                          borderRadius: "4px",
                          color: theme.palette.text.primary,
                          p: 0.8,
                          "&:hover": { background: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <ArrowBackIosIcon sx={{ fontSize: 12, pl: "4px" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleScroll("right")}
                        size="small"
                        sx={{
                          border: `1.5px solid ${theme.palette.divider}`,
                          borderRadius: "4px",
                          color: theme.palette.text.primary,
                          p: 0.8,
                          "&:hover": { background: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: 12, pl: "2px" }} />
                      </IconButton>
                  </Stack>
                </Stack>
              </CustomContainer>

              {/* Horizontal Scroll list — kept inside the container so it
                  aligns with the banner width below */}
              <CustomContainer>
              <CategoryScrollStrip ref={scrollRef}>
                {featuredCategories.map((cat, i) => (
                  <CategoryScrollItem key={cat.id || cat.name || i}>
                  <Box
                    onClick={() => {
                      if (router) {
                        router.push({
                          pathname: "/search",
                          query: {
                            category_id: cat.id || "",
                            search: cat.name || "all",
                            from: "category",
                          },
                        });
                      }
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "100%",
                      py: 2,
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "60px", sm: "68px", md: "74px" },
                        height: { xs: "60px", sm: "68px", md: "74px" },
                        borderRadius: "50%",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.23s ease-in-out",
                        p: 1.2,
                        "&:hover": {
                          transform: "scale(1.06)",
                          borderColor: theme.palette.primary.main,
                          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      {cat.image_full_url ? (
                        <Box
                          component="img"
                          src={cat.image_full_url}
                          alt={cat.name}
                          sx={{
                            width: "80%",
                            height: "80%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <StorefrontOutlinedIcon sx={{ fontSize: 26, color: theme.palette.text.secondary }} />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        mt: 1.2,
                        fontSize: { xs: "11px", md: "12px" },
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        lineHeight: 1.25,
                        width: "90%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </Box>
                  </CategoryScrollItem>
                ))}
              </CategoryScrollStrip>
              </CustomContainer>
            </Box>
          )}
        </Box>

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <Box
            sx={{
              background: theme.palette.background.paper,
              // Same section rhythm as the ecommerce home bands
              py: { xs: "12px", sm: "16px", md: "20px" },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CustomContainer>
              <Grid container spacing={{ xs: 2, md: 2 }} alignItems="stretch">
                {/* ── Left Column: Large Shopee Banner Carousel (`xs={12} md={8} lg={8.5}`) ── */}
                <Grid item xs={12} md={8} lg={8.5} sx={{ display: "flex" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      width: "100%",
                      minHeight: { xs: "160px", sm: "210px", md: "240px", lg: "260px" },
                      height: "100%",
                      border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                      boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                      "&:hover .carousel-arrow": {
                        opacity: 1,
                      },
                    }}
                  >
                    {/* Active Slide Image */}
                    {(() => {
                      const carouselSlides = promotionalBanner && promotionalBanner.length > 0
                        ? promotionalBanner.map(item => typeof item === "string" ? item : item?.img || item?.image_full_url)
                        : [banner1.src, banner2.src, promotionalBannerImg.src, banner3.src];
                      const currentSlideUrl = carouselSlides[activeBannerIndex % carouselSlides.length];
                      return (
                        <Box
                          component="img"
                          src={currentSlideUrl}
                          alt="Hero Promotional Banner"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "opacity 0.5s ease-in-out, transform 0.5s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => router.push("/search?search=")}
                        />
                      );
                    })()}

                    {/* Left Navigation Arrow */}
                    <IconButton
                      className="carousel-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        const total = promotionalBanner && promotionalBanner.length > 0 ? promotionalBanner.length : 4;
                        setActiveBannerIndex((prev) => (prev - 1 + total) % total);
                      }}
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.4)",
                        color: "#fff",
                        width: 36,
                        height: 36,
                        opacity: 0,
                        transition: "all 0.25s ease",
                        "&:hover": { background: "rgba(0, 0, 0, 0.75)" },
                      }}
                    >
                      <ArrowBackIosIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    </IconButton>

                    {/* Right Navigation Arrow */}
                    <IconButton
                      className="carousel-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        const total = promotionalBanner && promotionalBanner.length > 0 ? promotionalBanner.length : 4;
                        setActiveBannerIndex((prev) => (prev + 1) % total);
                      }}
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.4)",
                        color: "#fff",
                        width: 36,
                        height: 36,
                        opacity: 0,
                        transition: "all 0.25s ease",
                        "&:hover": { background: "rgba(0, 0, 0, 0.75)" },
                      }}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    {/* Indicator Dots (`• • • •`) */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: { xs: "50%", md: 24 },
                        transform: { xs: "translateX(50%)", md: "none" },
                        zIndex: 2,
                      }}
                    >
                      {(() => {
                        const total = promotionalBanner && promotionalBanner.length > 0 ? promotionalBanner.length : 4;
                        return Array.from({ length: total }).map((_, idx) => (
                          <Box
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBannerIndex(idx);
                            }}
                            sx={{
                              width: idx === activeBannerIndex % total ? 24 : 8,
                              height: 8,
                              borderRadius: 4,
                              background: idx === activeBannerIndex % total ? theme.palette.primary.main : "rgba(255, 255, 255, 0.65)",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                          />
                        ));
                      })()}
                    </Stack>
                  </Paper>
                </Grid>

                {/* ── Right Column: Two Stacked Banners (`xs={12} md={4} lg={3.5}`) ── */}
                <Grid item xs={12} md={4} lg={3.5}>
                  <Stack spacing={{ xs: 1.5, md: 1.5 }} sx={{ height: "100%", justifyContent: "space-between" }}>
                    {/* Top Right Banner Card */}
                    {(() => {
                      const topUrl = promotionalBanner && promotionalBanner.length > 1
                        ? (typeof promotionalBanner[1] === "string" ? promotionalBanner[1] : promotionalBanner[1]?.img || promotionalBanner[1]?.image_full_url)
                        : banner4.src;
                      return (
                        <Paper
                          elevation={0}
                          onClick={() => router.push("/search?search=")}
                          sx={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                            flex: 1,
                            minHeight: { xs: "75px", sm: "100px", md: "115px", lg: "123px" },
                            height: "calc(50% - 6px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                              "& .right-banner-1": { transform: "scale(1.05)" },
                            },
                          }}
                        >
                          <Box
                            component="img"
                            className="right-banner-1"
                            src={topUrl}
                            alt="Top Right Banner"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        </Paper>
                      );
                    })()}

                    {/* Bottom Right Banner Card */}
                    {(() => {
                      const bottomUrl = promotionalBanner && promotionalBanner.length > 2
                        ? (typeof promotionalBanner[2] === "string" ? promotionalBanner[2] : promotionalBanner[2]?.img || promotionalBanner[2]?.image_full_url)
                        : banner5.src;
                      return (
                        <Paper
                          elevation={0}
                          onClick={() => router.push("/search?search=")}
                          sx={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                            flex: 1,
                            minHeight: { xs: "75px", sm: "100px", md: "115px", lg: "123px" },
                            height: "calc(50% - 6px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                              "& .right-banner-2": { transform: "scale(1.05)" },
                            },
                          }}
                        >
                          <Box
                            component="img"
                            className="right-banner-2"
                            src={bottomUrl}
                            alt="Bottom Right Banner"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                          />
                        </Paper>
                      );
                    })()}
                  </Stack>
                </Grid>
              </Grid>
            </CustomContainer>
          </Box>

          {/* ═══════════════════════════════════════════
            TRUST STRIP
        ═══════════════════════════════════════════ */}
          <Box
            sx={{
              background: "#fff",
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: { xs: 1.5, md: 2 },
            }}
          >
            <CustomContainer>
              <Stack
                direction="row"
                justifyContent={{ xs: "flex-start", sm: "center" }}
                gap={{ xs: 2, sm: 4, md: 6 }}
                flexWrap="wrap"
              >
                {trustItems.map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: "12px", sm: "13px" },
                      fontWeight: 500,
                      "& svg": { color: theme.palette.primary.main },
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Stack>
                ))}
              </Stack>
            </CustomContainer>
          </Box>
        </Box>
    </Fade>
  );
};

export default HeroSection;
