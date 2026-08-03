import { alpha, Box, Divider, Stack, Typography, useTheme } from "@mui/material";

/**
 * Shared profile section header — matches Personal Details / My Orders style.
 */
const ProfileSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  showDivider = true,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box sx={sx}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}
        sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 1.75, md: 2 } }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} minWidth={0}>
          {Icon && (
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "2px",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Icon size={20} strokeWidth={2.1} />
            </Box>
          )}
          <Box minWidth={0}>
            <Typography
              fontSize={{ xs: "16px", md: "18px" }}
              fontWeight={700}
              color={theme.palette.primary.main}
              lineHeight={1.25}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                fontSize="12.5px"
                color={theme.palette.neutral[500]}
                sx={{ mt: 0.2 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>
      {showDivider && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />
      )}
    </Box>
  );
};

export default ProfileSectionHeader;
