import { useTheme } from "@emotion/react";
import { Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const SomeInfo = (props) => {
  const { iconType, title, info, t, href } = props;
  const theme = useTheme();

  const getIcon = () => {
    const size = 18;
    switch (iconType) {
      case "mail":
        return <Mail size={size} strokeWidth={2.1} />;
      case "phone":
        return <Phone size={size} strokeWidth={2.1} />;
      case "location":
        return <MapPin size={size} strokeWidth={2.1} />;
      default:
        return <Mail size={size} strokeWidth={2.1} />;
    }
  };

  const content = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: { xs: 72, sm: 80 },
        cursor: href || href === false ? "pointer" : "default",
        borderRadius: "2px",
        border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 1.75 },
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: theme.palette.background.paper,
        boxShadow: "none",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.45),
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          "& .info-title": {
            color: theme.palette.primary.main,
          },
          "& .icon-wrapper": {
            bgcolor: alpha(theme.palette.primary.main, 0.14),
          },
        },
      }}
    >
      <Box
        className="icon-wrapper"
        sx={{
          display: "grid",
          placeItems: "center",
          width: 40,
          height: 40,
          borderRadius: "2px",
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          flexShrink: 0,
          transition: "background-color 0.2s ease",
        }}
      >
        {getIcon()}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          className="info-title"
          fontWeight={700}
          fontSize={{ xs: "13px", sm: "14px" }}
          color={theme.palette.neutral[1000]}
          lineHeight={1.3}
          sx={{ transition: "color 0.2s ease" }}
        >
          {t(title)}
        </Typography>
        <Typography
          fontSize={{ xs: "12px", sm: "12.5px" }}
          color={theme.palette.neutral[600]}
          sx={{
            mt: 0.35,
            wordBreak: "break-word",
            lineHeight: 1.45,
          }}
        >
          {info || "—"}
        </Typography>
      </Box>
    </Box>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default SomeInfo;
