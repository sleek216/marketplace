import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  alpha,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ThemeSwitches from "../header/top-navbar/ThemeSwitches";
import CustomLanguage from "../header/top-navbar/language/CustomLanguage";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { Palette, Languages, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "@emotion/react";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

const SettingRow = ({ icon: Icon, title, subtitle, control, showDivider }) => {
  const theme = useTheme();
  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ px: { xs: 1.75, md: 2.5 }, py: { xs: 2, md: 2.25 } }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} minWidth={0}>
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
          <Box minWidth={0}>
            <Typography
              fontSize={{ xs: "14px", md: "15px" }}
              fontWeight={700}
              color={theme.palette.neutral[1000]}
              lineHeight={1.3}
            >
              {title}
            </Typography>
            <Typography
              fontSize="12.5px"
              color={theme.palette.neutral[500]}
              sx={{ mt: 0.25 }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ pl: { xs: 7, sm: 0 }, flexShrink: 0 }}>{control}</Box>
      </Stack>
      {showDivider && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />
      )}
    </>
  );
};

const CustomSettings = () => {
  const { countryCode, language } = useSelector((state) => state.configData);

  return (
    <CustomStackFullWidth sx={{ minHeight: "60vh" }}>
      <ProfileSectionHeader
        icon={SettingsIcon}
        title={t("Settings")}
        subtitle={t(
          "Customize your experience by adjusting theme and language preferences"
        )}
      />
      <Box>
        <SettingRow
          icon={Palette}
          title={t("Theme Settings")}
          subtitle={t("Switch between light and dark mode")}
          control={<ThemeSwitches />}
          showDivider
        />
        <SettingRow
          icon={Languages}
          title={t("Change language")}
          subtitle={t("Select your preferred language")}
          control={
            <CustomLanguage countryCode={countryCode} language={language} />
          }
        />
      </Box>
    </CustomStackFullWidth>
  );
};

export default CustomSettings;
