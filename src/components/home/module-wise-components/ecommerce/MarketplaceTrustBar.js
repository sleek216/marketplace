import { Box, Stack, Typography, useTheme } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import CustomContainer from "components/container";

const trustItems = [
  {
    icon: VerifiedOutlinedIcon,
    label: "Verified Sellers",
    description: "Trusted & verified sellers only",
  },
  {
    icon: LocalShippingOutlinedIcon,
    label: "Fast Delivery",
    description: "Quick delivery to your doorstep",
  },
  {
    icon: PaymentOutlinedIcon,
    label: "Secure Payment",
    description: "100% safe & secure payments",
  },
  {
    icon: SupportAgentOutlinedIcon,
    label: "24/7 Support",
    description: "We're here to help anytime",
  },
];

const MarketplaceTrustBar = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      aria-label="Marketplace benefits"
      sx={{
        bgcolor: theme.palette.mode === "dark"
          ? "background.paper"
          : theme.palette.neutral?.[100] || "background.custom3",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: { xs: 2, md: 2.5 },
      }}
    >
      <CustomContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(4, 1fr)",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {trustItems.map(({ icon: Icon, label, description }) => (
            <Stack
              key={label}
              direction="row"
              alignItems="center"
              gap={1.25}
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "action.hover"
                      : "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  color: "primary.main",
                }}
              >
                <Icon sx={{ fontSize: 22 }} aria-hidden="true" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "13px" },
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", sm: "11px" },
                    color: "text.secondary",
                    lineHeight: 1.35,
                    mt: 0.25,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </CustomContainer>
    </Box>
  );
};

export default MarketplaceTrustBar;
