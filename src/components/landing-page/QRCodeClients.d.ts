import React from "react";

export interface QRCodeClientProps {
  playStoreLink?: string | null;
  appStoreLink?: string | null;
  customUrl?: string | null;
  value?: string | null;
  size?: number;
  bare?: boolean;
}

declare function QRCodeClient(props: QRCodeClientProps): React.JSX.Element;
export default QRCodeClient;
