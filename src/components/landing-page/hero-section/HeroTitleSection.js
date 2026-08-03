import { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import {
  alpha,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getLanguage } from "helper-functions/getLanguage";
import DollarSignHighlighter from "../../DollarSignHighlighter";
import DownArrow from "../assets/DownArrow";
import DownArrowRTL from "../assets/DownArrowRTL";
import HeroLocationForm from "./HeroLocationForm";

const HeroTitleSection = ({ landingPageData }) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  return (
    <CustomStackFullWidth>
      <CustomStackFullWidth
        sx={{
          maxWidth: { xs: "100%", sm: "700px", md: "800px" },
          mx: "auto",
          width: "100%",
        }}
      >
        <HeroLocationForm />
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default HeroTitleSection;
