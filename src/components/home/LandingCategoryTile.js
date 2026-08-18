import React from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useRouter } from "next/router";
import { getModuleId } from "helper-functions/getModuleId";

/** Landing-parity category tile — Circular photo avatar + name label */
const LandingCategoryTile = ({ category, imageUrl }) => {
  const theme = useTheme();
  const router = useRouter();
  const name = category?.name;
  const id = category?.id;
  const img = imageUrl || category?.image_full_url;

  const isDarkMode = theme.palette.mode === "dark";

  const handleClick = () => {
    let activeModuleId = category?.module_id || getModuleId();
    if (!activeModuleId && typeof window !== "undefined") {
      try {
        const storedModule = JSON.parse(localStorage.getItem("module"));
        if (storedModule?.id) {
          activeModuleId = storedModule.id;
        }
      } catch (e) {}
    }

    if (activeModuleId) {
      router.push({
        pathname: "/home",
        query: {
          search: "category",
          id: `${id}`,
          module_id: `${activeModuleId}`,
          name: name || "",
          data_type: "category",
        },
      });
    } else {
      router.push({
        pathname: "/categories",
        query: { id: `${id}`, name: name || "" },
      });
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        flexShrink: 0,
        width: { xs: "85px", sm: "100px", md: "110px" },
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          "& .category-img-box": {
            transform: "scale(1.06)",
            boxShadow: isDarkMode
              ? "0px 8px 20px rgba(0, 0, 0, 0.4)"
              : `0px 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`,
            borderColor: theme.palette.primary.main,
          },
          "& .category-name-text": {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      {/* Circular Photo Avatar */}
      <Box
        className="category-img-box"
        sx={{
          width: { xs: "75px", sm: "90px", md: "100px" },
          height: { xs: "75px", sm: "90px", md: "100px" },
          borderRadius: "50%",
          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
          border: `1.5px solid ${
            isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"
          }`,
          boxShadow: isDarkMode
            ? "0px 3px 12px rgba(0, 0, 0, 0.3)"
            : "0px 3px 10px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease-in-out",
          position: "relative",
          p: 0,
        }}
      >
        {img ? (
          <Box
            component="img"
            src={img}
            alt={name}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <StorefrontOutlinedIcon
            sx={{ fontSize: 28, color: theme.palette.text.secondary }}
          />
        )}
      </Box>

      {/* Category Name Label */}
      <Typography
        className="category-name-text"
        sx={{
          mt: 1,
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          fontWeight: 600,
          color: isDarkMode ? theme.palette.text.primary : "#1E293B",
          lineHeight: 1.25,
          textAlign: "center",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "color 0.2s ease-in-out",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default LandingCategoryTile;
