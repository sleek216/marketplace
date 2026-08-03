const isAbsoluteUrl = (value = "") =>
  /^https?:\/\//i.test(value) || value.startsWith("data:image");

const joinUrl = (base = "", path = "") => {
  if (!base || !path) return undefined;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

const normalizeWithBase = (value, base) => {
  if (!value) return undefined;
  if (isAbsoluteUrl(value)) return value;
  return base ? joinUrl(base, value) : value;
};

export const getAdminAvatarUrl = (configData) => {
  if (!configData) return undefined;

  const businessBase = configData?.base_urls?.business_logo_url;

  // Try strongest candidates first, normalizing relative values when needed.
  const candidates = [
    configData?.logo_full_url,
    configData?.fav_icon_full_url,
    configData?.logo,
    configData?.fav_icon,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeWithBase(candidate, businessBase);
    if (normalized) return normalized;
  }

  return undefined;
};

