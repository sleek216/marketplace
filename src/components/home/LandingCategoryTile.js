import { Box, Typography, useTheme } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useRouter } from "next/router";
import { getModuleId } from "helper-functions/getModuleId";

/** Landing-parity category cell — circular icon + label inside scroll strip */
const LandingCategoryTile = ({ category, imageUrl }) => {
  const theme = useTheme();
  const router = useRouter();
  const name = category?.name;
  const id = category?.id;
  const img = imageUrl || category?.image_full_url;

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
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
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
        {img ? (
          <Box
            component="img"
            src={img}
            alt={name}
            sx={{
              width: "80%",
              height: "80%",
              objectFit: "contain",
            }}
          />
        ) : (
          <StorefrontOutlinedIcon
            sx={{ fontSize: 26, color: theme.palette.text.secondary }}
          />
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
        {name}
      </Typography>
    </Box>
  );
};

export default LandingCategoryTile;
