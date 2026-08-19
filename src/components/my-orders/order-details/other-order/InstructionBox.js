import React from "react";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { Box, Typography, alpha, Stack } from "@mui/material";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { FileText } from "lucide-react";

const InstructionBox = ({ title, note }) => {
  const theme = useTheme();
  if (!note) return null;

  return (
    <CustomStackFullWidth mt={1.5}>
      <Box
        sx={{
          p: { xs: 1.75, sm: 2 },
          borderRadius: "10px",
          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.neutral[100] || "#f8fafc", 0.7),
          boxShadow: "0 1px 6px rgba(0,0,0,0.02)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={0.75}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 26,
              height: 26,
              borderRadius: "6px",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <FileText size={14} />
          </Box>
          <Typography
            textTransform="capitalize"
            fontSize="13px"
            fontWeight={600}
            color="primary.main"
          >
            {t(title)}
          </Typography>
        </Stack>
        <Typography
          fontSize="13.5px"
          color="text.secondary"
          lineHeight={1.6}
          pl="34px"
        >
          {note}
        </Typography>
      </Box>
    </CustomStackFullWidth>
  );
};

export default InstructionBox;
