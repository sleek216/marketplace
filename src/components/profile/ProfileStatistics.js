import { useTheme } from "@emotion/react";
import { Paper, Skeleton, Typography, Box } from "@mui/material";
import { Stack, alpha } from "@mui/system";
import Router from "next/router";
import { useTranslation } from "react-i18next";
import { Calendar, Wallet, ShoppingBag, Award, User } from "lucide-react";

const ProfileStatistics = ({ value, title, pathname, isLoading }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getIcon = () => {
    const key = String(title || "").toLowerCase();
    if (key.includes("joining")) return <Calendar size={16} />;
    if (key.includes("wallet")) return <Wallet size={16} />;
    if (key.includes("order")) return <ShoppingBag size={16} />;
    if (key.includes("loyalty")) return <Award size={16} />;
    return <User size={16} />;
  };

  const handleRoute = () => {
    if (String(title || "").toLowerCase().includes("joining") || !pathname)
      return;
    Router.push(
      {
        pathname: "/profile",
        query: { page: pathname },
      },
      undefined,
      { shallow: true }
    );
  };

  const clickable =
    !String(title || "").toLowerCase().includes("joining") && Boolean(pathname);

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 74,
        padding: { xs: "12px", md: "14px 16px" },
        borderRadius: "2px",
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        backgroundColor: theme.palette.background.paper,
        cursor: clickable ? "pointer" : "default",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.04)}`,
        "&:hover": clickable
          ? {
              borderColor: alpha(theme.palette.primary.main, 0.35),
              boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.07)}`,
            }
          : undefined,
      }}
      elevation={0}
      onClick={handleRoute}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: "2px",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            flexShrink: 0,
          }}
        >
          {getIcon()}
        </Box>
        <Stack minWidth={0} spacing={0.2} flex={1}>
          <Typography
            sx={{
              fontSize: "11px",
              textTransform: "capitalize",
              color: theme.palette.neutral[500],
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {t(title)}
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={{ xs: "15px", md: "17px" }}
            color={theme.palette.primary.main}
            lineHeight={1.2}
            noWrap
          >
            {!isLoading ? (
              value ?? "—"
            ) : (
              <Skeleton variant="text" width="56px" height="22px" />
            )}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProfileStatistics;
