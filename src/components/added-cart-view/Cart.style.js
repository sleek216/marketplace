import { styled } from "@mui/material/styles";
import { alpha, Drawer, IconButton } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

export const CartDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: "1300",
  "& .MuiDrawer-paper": {
    width: "420px",
    height: "100vh",
    top: 0,
  },
}));

export const CustomCloseIconButton = styled(IconButton)(({ theme }) => ({
  padding: "6px",
  fontSize: "18px",
  borderRadius: "2px",
  color: theme.palette.text.secondary,
}));

export const CartIncrementStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
  padding: "2px",
  borderRadius: "2px",
  bgcolor: theme.palette.background.paper,
  minWidth: 32,
  gap: "2px",
}));

export const DeliveryProgressBarStack = styled(CustomStackFullWidth)(
  ({ theme }) => ({
    marginTop: "3rem",
    paddingInline: "1.4rem",
  })
);

export const EmptyCartBox = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.08),
  width: "80px",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "2px",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
}));
