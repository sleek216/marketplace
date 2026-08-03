import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import { Cookie as CookieIcon } from "lucide-react";

const Wrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  padding: theme.spacing(0, 2, 2, 2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  pointerEvents: "none",
}));

const BannerCard = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "980px",
  borderRadius: "14px",
  padding: theme.spacing(1.75, 2),
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg, rgba(23, 23, 23, 0.98) 0%, rgba(30, 30, 30, 0.95) 100%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 14px 34px rgba(0, 0, 0, 0.45)"
      : "0 10px 28px rgba(15, 23, 42, 0.12)",
  pointerEvents: "auto",
}));

const CookiesConsent = ({ text }) => {
  const [showConsent, setShowConsent] = useState(true);
  const { t } = useTranslation();
  const cookieMessage =
    text ||
    "We use cookies to improve your experience. By using GIFT Marketplace, you agree to our use of cookies.";

  const handleAccept = () => {
    localStorage.setItem("cookiesConsent", "true");
    setShowConsent(false);
  };
  const handleDeny = () => {
    localStorage.setItem("cookiesConsent", "false");
    setShowConsent(false);
  };
  let cookiesConsent;
  if (typeof window !== "undefined") {
    cookiesConsent = window.localStorage.getItem("cookiesConsent");
  }

  if (!showConsent || cookiesConsent === "true") {
    return null;
  }

  return (
    <Wrapper>
      <BannerCard>
        <CustomStackFullWidth
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <CookieIcon size={18} />
            <Typography
              sx={{
                color: (theme) => theme.palette.neutral[1000],
                fontSize: { xs: "13px", md: "14px" },
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              {cookieMessage}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Button
              id="cookies-deny-btn"
              variant="outlined"
              color="primary"
              onClick={handleDeny}
              sx={{ minWidth: { xs: "50%", md: "95px" } }}
            >
              {t("Deny")}
            </Button>
            <Button
              id="cookies-accept-btn"
              variant="contained"
              color="primary"
              onClick={handleAccept}
              sx={{
                minWidth: { xs: "50%", md: "110px" },
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {t("Accept")}
            </Button>
          </Stack>
        </CustomStackFullWidth>
      </BannerCard>
    </Wrapper>
  );
};

export default CookiesConsent;
