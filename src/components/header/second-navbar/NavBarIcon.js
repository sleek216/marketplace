import React from "react";
import { Badge, IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const NavBarIcon = ({ icon, label, user, handleClick, badgeCount }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        id="navbar-icon"
      >
        <IconButton
          sx={{
            height: "40px",
            width: "40px",
            padding: "8px",
          }}
          onClick={() => handleClick()}
        >
          <Tooltip
            title={t(label)}
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: (theme) => theme.palette.toolTipColor,
                  "& .MuiTooltip-arrow": {
                    color: (theme) => theme.palette.toolTipColor,
                  },
                },
              },
            }}
          >
            <Badge
              color="primary"
              badgeContent={badgeCount}
              invisible={badgeCount == null}
            >
              {icon}
            </Badge>
          </Tooltip>
          {/*<Typography color={theme.palette.neutral[1000]}>{label}</Typography>*/}
        </IconButton>
      </Stack>
    </>
  );
};

export default NavBarIcon;
