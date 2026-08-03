import { Box, Button, IconButton, Stack, alpha, styled } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

export const CodePreviewWrapper = styled(CustomStackFullWidth)(({ theme }) => ({
    paddingInlineStart: "16px",
    paddingInlineEnd: "8px",
    paddingBlock: "4px",
    border: "1px dashed",
    borderColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "2px",
    [theme.breakpoints.down("md")]: {
        padding: "10px",
    },
}));

export const ReferralShareBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "transparent",
    padding: "5px",
    borderRadius: "2px",
    gap: "0.75rem",
}));

export const ShareButton = styled(IconButton)(({ theme, size }) => ({
    height: size || "36px",
    width: size || "36px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "2px",
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    boxShadow: "none",
    padding: "5px",
}));