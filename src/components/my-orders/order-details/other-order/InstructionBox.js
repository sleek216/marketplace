import React from "react";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { Box, Typography, alpha } from "@mui/material";
import { t } from "i18next";
import { useTheme } from "@emotion/react";

const InstructionBox = ({ title, note }) => {
  const theme = useTheme();
  if (!note) return null;

  return (
    <CustomStackFullWidth mt={1.5} spacing={1}>
      <Typography
        textTransform="capitalize"
        fontSize="13px"
        fontWeight={600}
        color={theme.palette.neutral[700]}
      >
        {t(title)}
      </Typography>
      <Box
        sx={{
          px: 1.75,
          py: 1.5,
          borderRadius: "2px",
          border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Typography
          fontSize="13px"
          color={theme.palette.neutral[700]}
          lineHeight={1.5}
          sx={{ textTransform: "capitalize" }}
        >
          {note}
        </Typography>
      </Box>
    </CustomStackFullWidth>
  );
};

export default InstructionBox;
