import { Box, Button, Stack, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";

/**
 * Landing-matched section header for marketplace / module homes.
 * Title 16/18, subtitle 11–12, optional "See all" — no decorative icons.
 */
const MarketplaceSectionHeader = ({
  title,
  subtitle,
  onSeeAll,
  seeAllLabel = "See all",
  mb = 1.5,
  rightSlot,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1.5}
      mb={mb}
    >
      <Box minWidth={0} sx={{ textAlign: "left" }}>
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "16px", md: "18px" },
            lineHeight: 1.2,
            color: "text.primary",
            textTransform: "none",
            textAlign: "left",
          }}
        >
          {t(title)}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              mt: 0.2,
              fontSize: { xs: "11px", sm: "12px" },
              color: "text.secondary",
              display: { xs: "none", sm: "block" },
              lineHeight: 1.35,
              textAlign: "left",
            }}
          >
            {t(subtitle)}
          </Typography>
        )}
      </Box>

      {rightSlot ||
        (onSeeAll && (
          <Button
            onClick={onSeeAll}
            endIcon={
              <ChevronRightIcon sx={{ fontSize: "18px !important" }} />
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "12px", md: "13px" },
              color: "primary.main",
              px: { xs: 0.75, sm: 1 },
              minWidth: "auto",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
              },
            }}
          >
            {t(seeAllLabel)}
          </Button>
        ))}
    </Stack>
  );
};

export default MarketplaceSectionHeader;
