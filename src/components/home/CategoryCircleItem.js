import { Skeleton, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Link from "next/link";
import { getModuleId } from "helper-functions/getModuleId";

/**
 * Landing-style circular category cell (shared by landing + module homes).
 */
const CategoryCircleItem = ({
  image,
  title,
  id,
  onlyshimmer,
  href,
}) => {
  const theme = useTheme();

  const content = (
    <Box
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
        {onlyshimmer ? (
          <Skeleton variant="circular" width="100%" height="100%" />
        ) : image ? (
          <Box
            component="img"
            src={image}
            alt={title || ""}
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
        {onlyshimmer ? <Skeleton variant="text" width="50px" sx={{ mx: "auto" }} /> : title}
      </Typography>
    </Box>
  );

  if (onlyshimmer) {
    return content;
  }

  const linkHref =
    href ||
    {
      pathname: "/home",
      query: {
        search: "category",
        id: id,
        module_id: `${getModuleId()}`,
        name: title || "",
        data_type: "category",
      },
    };

  return (
    <Link href={linkHref} passHref style={{ width: "100%", textDecoration: "none" }}>
      {content}
    </Link>
  );
};

export default CategoryCircleItem;
