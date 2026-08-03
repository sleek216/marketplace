export const getBannerImageUrl = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item?.image_full_url || item?.img || "";
};

export const toBannerSlides = (items = []) =>
  items
    .map((item, index) => ({
      id: item?.id ?? `banner-${index}`,
      src: getBannerImageUrl(item),
      alt: item?.title || item?.name || "Promotional banner",
      data: item,
    }))
    .filter((slide) => Boolean(slide.src));
