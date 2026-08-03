import React from "react";
import { ChevronDown as KeyboardArrowDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@mui/material";
import { useSelector } from "react-redux";
import { NavMenuLink } from "../NavBar.style";
import NavPopover from "./NavPopover";
import { prefetchCategoryPopoverData } from "./CategoryPopover";
import { useNavDropdown } from "./useNavDropdown";

const NavCategory = ({ isOpen, anchorEl, onOpen, onClose }) => {
  const { t } = useTranslation();
  const { modules } = useSelector((state) => state.configData);
  const {
    anchorRef,
    paperRef,
    handleToggle,
    handleClickAway,
    handleMouseEnter,
    handleMouseLeave,
  } = useNavDropdown({
    isOpen,
    onOpen,
    onClose,
  });

  const handlePrefetch = () => {
    prefetchCategoryPopoverData(modules ?? []);
  };

  const handleTriggerMouseEnter = () => {
    handlePrefetch();
    handleMouseEnter();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <NavMenuLink
          ref={anchorRef}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="true"
          onMouseEnter={handleTriggerMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handlePrefetch}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleToggle(e);
            if (e.key === "Escape") onClose?.();
          }}
          sx={{
            textTransform: "capitalize",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            px: 1.25,
            py: 0.85,
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            userSelect: "none",
            color: isOpen ? "primary.main" : undefined,
            backgroundColor: isOpen ? "action.selected" : "transparent",
            "&:hover": {
              color: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          {t("Categories")}
          <KeyboardArrowDownIcon
            size={16}
            style={{
              transition: "transform 0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </NavMenuLink>

        <NavPopover
          popoverFor="category"
          open={isOpen}
          anchorEl={anchorEl || anchorRef.current}
          onClose={onClose}
          paperRef={paperRef}
          onPaperMouseEnter={handleMouseEnter}
          onPaperMouseLeave={handleMouseLeave}
        />
      </div>
    </ClickAwayListener>
  );
};

export default NavCategory;
