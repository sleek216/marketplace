import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export function getProductShareUrl(productId, moduleId) {
  if (!productId || typeof window === "undefined") return "";
  const params = new URLSearchParams({ product_id: String(productId) });
  if (moduleId) {
    params.set("module_id", String(moduleId));
  }
  return `${window.location.origin}/home?${params.toString()}`;
}

export default function useProductShare(productId, productName, moduleId) {
  const { t } = useTranslation();
  const [openShareModal, setOpenShareModal] = useState(false);
  const shareUrl = useMemo(
    () => getProductShareUrl(productId, moduleId),
    [productId, moduleId]
  );

  const handleCopy = useCallback(
    (url) => {
      navigator.clipboard.writeText(url);
      toast.success(t("Your product URL has been copied"));
    },
    [t]
  );

  const handleShareClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!shareUrl) return;
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator
          .share({
            title: productName,
            url: shareUrl,
          })
          .catch(() => setOpenShareModal(true));
        return;
      }
      setOpenShareModal(true);
    },
    [shareUrl, productName]
  );

  return {
    openShareModal,
    setOpenShareModal,
    shareUrl,
    handleCopy,
    handleShareClick,
  };
}
