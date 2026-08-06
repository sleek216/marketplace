import React from "react";
import { styled } from "@mui/material/styles";
import { alpha, Stack, Typography, IconButton } from "@mui/material";
import { t } from "i18next";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CustomCloseIconButton } from "./Cart.style";

const DrawerHeaderWrapper = styled(Stack)(({ theme }) => ({
  width: "100%",
  padding: "14px 16px",
  background: theme.palette.background.paper,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  flexShrink: 0,
}));

const DrawerHeader = ({
  CartIcon,
  title,
  closeHandler,
  onDeleteSelected,
  disableDelete,
  showDeleteAction = false,
  showBackButton = false,
  onBack,
}) => {
  return (
    <DrawerHeaderWrapper>
      <Stack direction="row" spacing={1} alignItems="center">
        {showBackButton && onBack ? (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              borderRadius: "6px",
              p: "4px",
              color: (theme) => theme.palette.text.secondary,
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.divider, 0.35),
              },
              transition: "all 0.18s ease",
            }}
            aria-label={t("Back to modules")}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
        ) : (
          CartIcon
        )}
        <Typography fontSize="16px" fontWeight={700} color="text.primary">
          {t(title)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        {showDeleteAction && (
          <CustomCloseIconButton
            onClick={onDeleteSelected}
            disabled={disableDelete}
            sx={{
              opacity: disableDelete ? 0.45 : 1,
              borderRadius: "2px",
              color: (theme) => theme.palette.error.main,
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
            aria-label={t("Delete selected items")}
          >
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </CustomCloseIconButton>
        )}
        <CustomCloseIconButton
          onClick={closeHandler}
          sx={{
            borderRadius: "2px",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.divider, 0.4),
            },
          }}
        >
          <ClearIcon sx={{ fontSize: 20 }} />
        </CustomCloseIconButton>
      </Stack>
    </DrawerHeaderWrapper>
  );
};

export default DrawerHeader;
