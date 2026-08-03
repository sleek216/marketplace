import React from "react";
import { styled } from "@mui/material/styles";
import { alpha, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
}) => {
  return (
    <DrawerHeaderWrapper>
      <Stack direction="row" spacing={1} alignItems="center">
        {CartIcon}
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
