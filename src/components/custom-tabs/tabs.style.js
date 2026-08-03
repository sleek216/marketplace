import { styled, Tabs } from "@mui/material";
import { Stack } from "@mui/system";

export const CustomTab = styled(Tabs)(({ theme }) => ({
  minHeight: "36px",
  "& .MuiTabs-flexContainer": {
    gap: theme.spacing(1),
  },
  "& .MuiTabs-indicator": {
    height: "2px",
    borderRadius: "2px",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiButtonBase-root": {
    minHeight: "36px",
    minWidth: "auto",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "4px",
    paddingRight: "4px",
    fontWeight: 600,
    fontSize: "14px",
    color: theme.palette.neutral[600],
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
}));
export const CustomOverFlowStack = styled(Stack)(({ theme, height }) => ({
  overflow: "auto",
  height: height,
}));
