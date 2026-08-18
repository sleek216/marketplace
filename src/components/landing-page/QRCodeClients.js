import QRCode from "react-qr-code";

export default function QRCodeClient({
  playStoreLink,
  appStoreLink,
  customUrl,
  value,
  size = 200,
  bare = false,
}) {
  let redirectUrl = value || customUrl;

  if (!redirectUrl) {
    const redirectPath = `/app-redirect?playStore=${encodeURIComponent(
      playStoreLink || ""
    )}&appStore=${encodeURIComponent(appStoreLink || "")}`;

    redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${redirectPath}`
        : `window.location.origin${redirectPath}`;
  }

  if (bare) {
    return <QRCode value={redirectUrl || "https://google.com"} size={size} />;
  }

  return (
    <div
      style={{
        padding: 10,
        background: "white",
        display: "inline-block",
        border: "1px solid #e5e7eb",
        borderRadius: "4px",
      }}
    >
      <QRCode value={redirectUrl} size={size} />
    </div>
  );
}
