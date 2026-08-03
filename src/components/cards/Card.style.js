import { Stack, styled } from "@mui/material";

export const CustomOverLay = styled(Stack)(
  ({ theme, hover, border_radius }) => ({
    background: "rgba(75, 86, 107, 0.50)",
    borderRadius: border_radius ? border_radius : "8px 8px 0px 0px",
    width: "100%",
    opacity: hover ? 1 : 0,
    inset: 0,
    position: "absolute",
    top: 0,
    zIndex: 1,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      opacity: 1,
    },
  })
);
