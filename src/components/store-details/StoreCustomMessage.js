import React from "react";
import { alpha, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Megaphone } from "lucide-react";

const StoreCustomMessage = ({ storeAnnouncement }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  if (!storeAnnouncement?.trim()) return null;

  const shouldMarquee = isSmall
    ? storeAnnouncement.length > 28
    : storeAnnouncement.length > 72;

  const marqueeDuration = Math.max(12, storeAnnouncement.length * 0.35);

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 0 }, py: { xs: 0.5, md: 0 } }}>
      <Box
        role="status"
        aria-live="polite"
        sx={{
        display: "flex",
        alignItems: "stretch",
        borderRadius: "2px",
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
        boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.6)}, 0 2px 10px ${alpha(theme.palette.primary.main, 0.14)}`,
        minHeight: { xs: "42px", md: "48px" },
        }}
      >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          flexShrink: 0,
          px: { xs: 1.25, md: 1.5 },
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Megaphone size={isSmall ? 17 : 19} strokeWidth={2.5} aria-hidden />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: { xs: "10px", md: "11px" },
            whiteSpace: "nowrap",
            display: { xs: "none", sm: "block" },
          }}
        >
          Announcement
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          px: { xs: 1.25, md: 1.75 },
          py: 0.75,
          overflow: "hidden",
          position: "relative",
          "&::before, &::after": shouldMarquee
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "20px",
                zIndex: 1,
                pointerEvents: "none",
              }
            : {},
          "&::before": shouldMarquee
            ? {
                left: 0,
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
              }
            : {},
          "&::after": shouldMarquee
            ? {
                right: 0,
                background: `linear-gradient(270deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
              }
            : {},
        }}
      >
        {shouldMarquee ? (
          <Box
            sx={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              animation: `announcement-marquee ${marqueeDuration}s linear infinite`,
              "@keyframes announcement-marquee": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-50%)" },
              },
            }}
          >
            {[0, 1].map((index) => (
              <Typography
                key={index}
                component="span"
                aria-hidden={index === 1}
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  fontWeight: 600,
                  color: theme.palette.primary.dark,
                  whiteSpace: "nowrap",
                  px: 2,
                }}
              >
                {storeAnnouncement}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 600,
              color: theme.palette.primary.dark,
              width: "100%",
              textAlign: { xs: "left", md: "center" },
              lineHeight: 1.35,
            }}
          >
            {storeAnnouncement}
          </Typography>
        )}
      </Box>
    </Box>
    </Box>
  );
};

export default StoreCustomMessage;
