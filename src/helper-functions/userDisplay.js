/**
 * Display name and initials for navbar / profile when photo is missing.
 */
export function getUserDisplayName(profile) {
  if (!profile) return "";
  const first = (profile.f_name || "").trim();
  const last = (profile.l_name || "").trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (profile.phone) return String(profile.phone).trim();
  if (profile.email) return String(profile.email).trim();
  return "";
}

export function getUserInitials(profile) {
  const name = getUserDisplayName(profile);
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] || "";
    const b = parts[parts.length - 1][0] || "";
    return `${a}${b}`.toUpperCase().slice(0, 2);
  }
  if (/^\+?[\d\s-]+$/.test(name)) {
    return name.replace(/\D/g, "").slice(-2) || "?";
  }
  return name.slice(0, 2).toUpperCase();
}
