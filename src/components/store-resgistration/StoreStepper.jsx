import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  alpha,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Box from "@mui/material/Box";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  "&.MuiStepConnector-root": {
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiStepConnector-line": {
    border: "none",
    borderTop: "none",
    width: "100%",
    height: "3px",
    background: `linear-gradient(90deg, ${alpha(
      theme.palette.primary.main,
      0.12
    )}, ${alpha(theme.palette.primary.main, 0.02)})`,
  },
}));

const CustomStep = styled(Step)(({ theme, active, complete, isSmallSize }) => ({
  "& .MuiStepLabel-root": {
    padding: isSmallSize ? "6px 4px" : "14px 24px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  "& .MuiStepLabel-iconContainer": {
    marginRight: isSmallSize ? "6px" : "10px",
  },
  "& .MuiStepLabel-iconContainer .MuiSvgIcon-root": {
    width: isSmallSize ? 20 : 26,
    height: isSmallSize ? 20 : 26,
    borderRadius: "50%",
    boxShadow: active
      ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`
      : "none",
  },
  "& .MuiStepLabel-label": {
    fontWeight: 500,
    textTransform: "none",
    letterSpacing: 0,
    color: complete
      ? theme.palette.primary.main
      : active
      ? theme.palette.text.primary
      : theme.palette.neutral[500],
    fontSize: isSmallSize ? "11px" : "14px",
    lineHeight: 1.4,
  },
}));

const steps = ["General Information", "Business Plan", "Complete Registration"];

const CustomStepper = ({ activeStep, flag }) => {
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down("md"));
  let lanDirection = undefined;
  if (typeof window !== "undefined") {
    lanDirection = JSON.parse(localStorage.getItem("settings"));
  }

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: { xs: "10px", md: "14px" },
        padding: { xs: "10px 8px", md: "14px 18px" },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.neutral[800], 0.8)
            : alpha(theme.palette.primary.main, 0.03),
        boxShadow: `0px 8px 24px ${alpha(theme.palette.neutral[900], 0.06)}`,
      }}
    >
      <Stepper
        sx={{
          paddingRight: 0,
          paddingLeft: 0,
        }}
        alternativeLabel={isSmallSize}
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => {
          const isComplete = index < activeStep;
          return (
            <CustomStep
              isSmallSize={isSmallSize}
              sx={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
              key={label}
              active={index === activeStep}
              complete={isComplete}
            >
              <StepLabel>{label}</StepLabel>
            </CustomStep>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default function StoreStepper({ activeStep, flag }) {
  return (
    <CustomStackFullWidth
      sx={{
        marginTop: { xs: "16px", md: "32px" },
        maxWidth: "960px",
        mx: "auto",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <CustomStepper flag={flag} activeStep={activeStep} />
    </CustomStackFullWidth>
  );
}
