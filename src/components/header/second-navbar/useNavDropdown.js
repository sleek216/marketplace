import { useCallback, useEffect, useRef } from "react";

const HOVER_CLOSE_DELAY = 300;
// Ignore the click that immediately follows a hover-open (touch devices fire
// mouseenter + click together; desktop users often hover then click).
const HOVER_CLICK_GRACE = 600;

const isHoverCapable = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover)")?.matches;

/**
 * Reliable open/close handling for navbar mega-menu dropdowns.
 * Supports hover-to-open (desktop) alongside click/keyboard toggling,
 * and guards against ClickAwayListener closing on the same click that opens.
 */
export function useNavDropdown({ isOpen, onOpen, onClose }) {
  const anchorRef = useRef(null);
  const paperRef = useRef(null);
  const suppressClickAwayRef = useRef(false);
  const closeTimerRef = useRef(null);
  const hoverOpenedAtRef = useRef(0);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => cancelScheduledClose, [cancelScheduledClose]);

  const handleToggle = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      suppressClickAwayRef.current = true;
      window.setTimeout(() => {
        suppressClickAwayRef.current = false;
      }, 0);

      if (isOpen) {
        // Don't close on the click that follows a hover-open.
        if (Date.now() - hoverOpenedAtRef.current < HOVER_CLICK_GRACE) return;
        onClose?.();
      } else {
        onOpen?.(event.currentTarget);
      }
    },
    [isOpen, onOpen, onClose]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isHoverCapable()) return;
    cancelScheduledClose();
    if (!isOpen) {
      hoverOpenedAtRef.current = Date.now();
      onOpen?.(anchorRef.current);
    }
  }, [isOpen, onOpen, cancelScheduledClose]);

  const handleMouseLeave = useCallback(() => {
    if (!isHoverCapable()) return;
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose?.();
    }, HOVER_CLOSE_DELAY);
  }, [onClose, cancelScheduledClose]);

  const handleClickAway = useCallback(
    (event) => {
      if (suppressClickAwayRef.current) return;
      if (anchorRef.current?.contains(event.target)) return;
      if (paperRef.current?.contains(event.target)) return;
      onClose?.();
    },
    [onClose]
  );

  return {
    anchorRef,
    paperRef,
    handleToggle,
    handleClickAway,
    handleMouseEnter,
    handleMouseLeave,
  };
}
