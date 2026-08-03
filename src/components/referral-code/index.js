import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  alpha,
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import CodePreview from "./CodePreview";
import HowItWorks from "./HowItWorks";
import { t } from "i18next";
import { Smartphone, Gift } from "lucide-react";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

const ReferralCode = (props) => {
  const { configData } = props;
  const theme = useTheme();

  return (
    <CustomStackFullWidth sx={{ minHeight: "60vh" }}>
      <ProfileSectionHeader
        icon={Smartphone}
        title={t("Referral Code")}
        subtitle={t("Invite friends and earn rewards")}
      />
      <Box sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2.5} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                borderRadius: "2px",
                bgcolor: "primary.main",
                color: "#fff",
                p: { xs: 2, md: 2.5 },
                mb: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "2px",
                    bgcolor: alpha("#fff", 0.15),
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Gift size={20} />
                </Box>
                <Box>
                  <Typography fontSize="12.5px" sx={{ opacity: 0.9 }}>
                    {t("You can earn")}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "22px", md: "26px" }}
                    fontWeight={700}
                    lineHeight={1.2}
                    my={0.5}
                  >
                    {getAmountWithSign(configData?.ref_earning_exchange_rate)}
                  </Typography>
                  <Typography fontSize="12.5px" sx={{ opacity: 0.9 }}>
                    {t("for every referral!")}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Typography
              fontSize="13px"
              color={theme.palette.neutral[600]}
              lineHeight={1.6}
            >
              {t("Refer your code to your friends and get")}{" "}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {getAmountWithSign(configData?.ref_earning_exchange_rate)}
              </Box>{" "}
              {t("for every referral!")}
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <CodePreview t={t} />
          </Grid>

          <Grid item xs={12}>
            <HowItWorks configData={configData} />
          </Grid>
        </Grid>
      </Box>
    </CustomStackFullWidth>
  );
};

export default ReferralCode;
