import React from "react";
import { Button, Popover, Stack, styled, Typography, alpha } from "@mui/material";
import sort from "./assets/sort.png";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomImageContainer from "components/CustomImageContainer";

const Wrapper = styled(Button)(({ theme, active }) => ({
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  borderRadius: "8px",
  minHeight: "36px",
  padding: "6px 14px",
  textTransform: "none",
  backgroundColor:
    active === "true"
      ? alpha(theme.palette.primary.main, 0.08)
      : theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const HighToLow = ({ handleSortBy, sortBy }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    handleSortBy?.(value);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const sortOptions = [
    { name: t("High to Low"), value: "high" },
    { name: t("Low to High"), value: "low" },
  ];
  const Sort_by = t("Sort by:");

  const getContent = (label, showArrow) => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <CustomImageContainer
          src={sort?.src}
          height="12px"
          width="12px"
          objectFit="contain"
        />
        <Typography
          fontSize="12.5px"
          fontWeight={600}
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          {`${Sort_by} ${label}`}
        </Typography>
        {showArrow === "true" &&
          (open ? (
            <KeyboardArrowUpIcon
              sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
            />
          ))}
      </Stack>
    );
  };

  return (
    <div>
      <Wrapper active={open ? "true" : "false"} onClick={handleClick}>
        {getContent(
          sortOptions.find((option) => option.value === sortBy)?.name ||
            t("Default"),
          "true"
        )}
      </Wrapper>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 0.75,
            borderRadius: "10px",
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            width: anchorEl?.clientWidth || "auto",
            minWidth: "160px",
          },
        }}
      >
        <Stack spacing={0.5}>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              fullWidth
              onClick={() => handleSelect(option.value)}
              sx={{
                justifyContent: "flex-start",
                py: 0.8,
                px: 1.5,
                borderRadius: "6px",
                textTransform: "none",
                fontSize: "12.5px",
                fontWeight: sortBy === option.value ? 700 : 500,
                color:
                  sortBy === option.value
                    ? "primary.main"
                    : "text.primary",
                backgroundColor:
                  sortBy === option.value
                    ? (theme) => alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              {option.name}
            </Button>
          ))}
        </Stack>
      </Popover>
    </div>
  );
};

export default HighToLow;
