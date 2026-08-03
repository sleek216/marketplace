import { Box, Stack, Typography, useTheme } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import CustomContainer from "../container";

const trustItems = [
  { icon: VerifiedOutlinedIcon, label: "Verified Sellers" },
  { icon: LocalShippingOutlinedIcon, label: "Fast Delivery" },
  { icon: PaymentOutlinedIcon, label: "Secure Payment" },
  { icon: SupportAgentOutlinedIcon, label: "24/7 Support" },
];

/** Landing hero trust strip — icon + label row */
const LandingTrustStrip = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: { xs: 1.5, md: 2 },
        width: "100%",
      }}
    >
      <CustomContainer>
        <Stack
          direction="row"
          justifyContent={{ xs: "flex-start", sm: "center" }}
          gap={{ xs: 2, sm: 4, md: 6 }}
          flexWrap="wrap"
        >
          {trustItems.map(({ icon: Icon, label }) => (
            <Stack
              key={label}
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
              <Icon fontSize="small" />
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "inherit",
                }}
              >
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CustomContainer>
    </Box>
  );
};

export default LandingTrustStrip;
