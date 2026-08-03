import { useTheme } from "@emotion/react";
import {
  Button,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import appleicon from "../../../../public/static/footer/apple.svg";
import playstoreicon from "../../../../public/static/footer/playstore.svg";
import NextImage from "components/NextImage";

export const CustomButton = styled(Button)(({ theme, graybackground }) => ({
  height: "40px",
  minHeight: "40px",
  padding: "6px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  width: "100%",
  backgroundColor:
    graybackground === "true"
      ? theme.palette.footer.appDownloadButtonBgGray
      : theme.palette.footer.appDownloadButtonBg,
  "&:hover": {
    backgroundColor: theme.palette.footer.appDownloadButtonBgHover,
  },
  [theme.breakpoints.up("sm")]: {
    width: "auto",
    minWidth: "140px",
    maxWidth: "160px",
  },
}));
const AppLinks = (props) => {
  const { graybackground, landingPageData } = props;
  const theme = useTheme();

  let language_direction;
  if (typeof window !== "undefined") {
    language_direction = window.localStorage.getItem("direction");
  }
  const goToApp = (href) => {
    window.open(href);
  };
  const { t } = useTranslation();
  const googlePlay = () => (
    <CustomButton
      onClick={() =>
        goToApp(landingPageData?.play_store_link)
      }
      variant="contained"
      graybackground={graybackground ? "true" : "false"}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={.5}
      >
        <NextImage
          src={playstoreicon?.src}
          alt="GooglePlay"
          objectFit="cover"
          height={20}
          width={20}
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography
            sx={{
              fontSize: { xs: "8px", sm: "10px", md: "11px" },
              color: theme.palette.whiteContainer.main,
              lineHeight: { xs: "10px", sm: "13px", md: "10px" },
            }}
          >
            {t("GET IT ON")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "10px", sm: "13px", md: "12px" },
            }}
            color={theme.palette.whiteContainer.main}
          >
            Google Play
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );
  const appleStore = () => (
    <CustomButton
      onClick={() =>
        goToApp(landingPageData?.app_store_link)
      }
      variant="contained"
      graybackground={graybackground ? "true" : "false"}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0.5}
      >
        <NextImage
          src={appleicon?.src}
          alt="GooglePlay"
          objectFit="cover"
          height={20}
          width={20}
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography
            sx={{
              fontSize: { xs: "8px", sm: "10px", md: "11px" },
              color: theme.palette.whiteContainer.main,
              lineHeight: { xs: "10px", sm: "13px", md: "10px" },
            }}
          >
            {t("Download ON")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "10px", sm: "12px", md: "12px" },
            }}
            color={theme.palette.whiteContainer.main}
          >
            {t("App Store")}
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );
  const showPlayStore = Number(landingPageData?.play_status) === 1;
  const showAppStore = Number(landingPageData?.app_status) === 1;

  // console.log({ showPlayStore, showAppStore });
  if (!showPlayStore && !showAppStore) return null;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1.25, sm: 1.5 }}
      gap={language_direction === "rtl" ? "10px" : undefined}
      alignItems="stretch"
      justifyContent={{ xs: "center", md: "flex-start" }}
      sx={{
        width: "100%",
        maxWidth: { xs: "280px", sm: "none" },
        mx: { xs: "auto", md: 0 },
      }}
    >
      {showPlayStore && googlePlay()}
      {showAppStore && appleStore()}
    </Stack>
  );
};

AppLinks.propTypes = {};

export default AppLinks;
