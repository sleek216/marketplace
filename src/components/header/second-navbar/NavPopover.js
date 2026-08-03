import React, { useId, useLayoutEffect, useState } from "react";
import { Popover } from "@mui/material";
import CategoryPopover from "./CategoryPopover";
import { getLanguage } from "helper-functions/getLanguage";
import NavStorePopover from "./NavStorePopover";

const DROPDOWN_OFFSET = 14;

const NavPopover = ({
  open,
  anchorEl,
  popoverFor,
  onClose,
  paperRef,
  onPaperMouseEnter,
  onPaperMouseLeave,
}) => {
  const popoverDivId = useId();
  const [topOffset, setTopOffset] = useState(0);

  useLayoutEffect(() => {
    if (!open || !anchorEl) {
      setTopOffset(0);
      return undefined;
    }

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect?.();
      if (rect?.bottom != null) {
        setTopOffset(rect.bottom + DROPDOWN_OFFSET);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorEl]);

  if (!open || !anchorEl) {
    return null;
  }

  return (
    <Popover
      disableScrollLock
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      id={popoverDivId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: getLanguage() === "rtl" ? "right" : "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: getLanguage() === "rtl" ? "right" : "left",
      }}
      ModalProps={{
        hideBackdrop: true,
        disableScrollLock: true,
      }}
      PaperProps={{
        ref: paperRef,
        onMouseEnter: onPaperMouseEnter,
        onMouseLeave: onPaperMouseLeave,
        elevation: 0,
        sx: {
          // Paper itself stays interactive while the modal root lets
          // pointer events through (required for hover-open menus).
          pointerEvents: "auto",
          position: "fixed !important",
          top: `${topOffset}px !important`,
          left: "0 !important",
          right: "0 !important",
          width: "100vw !important",
          maxWidth: "100vw !important",
          borderRadius: "0 !important",
          mt: "0 !important",
          borderTop: "2px solid",
          borderColor: "primary.main",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          overflow: "auto",
          maxHeight: `calc(100vh - ${topOffset + 4}px)`,
        },
      }}
      // pointerEvents none: the invisible modal root must not swallow hover
      // events on the nav triggers underneath, otherwise the menu opens and
      // instantly schedules a close (flicker) and the sibling dropdown can't
      // be hovered while one is open.
      sx={{ zIndex: 1400, pointerEvents: "none" }}
    >
      {popoverFor === "category" ? (
        <CategoryPopover onClose={onClose} />
      ) : (
        <NavStorePopover onClose={onClose} />
      )}
    </Popover>
  );
};

export default NavPopover;
