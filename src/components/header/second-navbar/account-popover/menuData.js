import { ShoppingBag as ShoppingCartCheckoutIcon, UserCircle as AccountCircleIcon, Ticket as ConfirmationNumberIcon, Wallet as WalletIcon, Gift as LoyaltyIcon, Smartphone as SendToMobileIcon, MessageCircle as InboxIcon, Settings as SettingsIcon, Truck as LocalShippingOutlinedIcon, Car as LocalTaxiIcon } from "lucide-react";
export const menuData = [
  {
    id: 1,
    name: "profile-settings",
    icon: <AccountCircleIcon />,
    path: "/profile",
  },
  {
    id: 2,
    name: "my-orders",
    icon: <ShoppingCartCheckoutIcon />,
    path: "/my-orders",
  },
  {
    id: 3,
    name: "my-trips",
    icon: <LocalTaxiIcon />,
    path: "/my-trips",
  },
  {
    id: 4,
    name: "wallet",
    icon: <WalletIcon />,
    path: "/wallet",
  },
  {
    id: 5,
    name: "coupons",
    icon: <ConfirmationNumberIcon />,
    path: "/coupons",
  },

  {
    id: 6,
    name: "loyalty-points",
    icon: <LoyaltyIcon />,
    path: "/loyalty-points",
  },
  {
    id: 7,
    name: "referral-code",
    icon: <SendToMobileIcon />,
    path: "/referral-code",
  },
  {
    id: 8,
    name: "inbox",
    icon: <InboxIcon />,
    path: "/profile?page=inbox",
  },
  {
    id: 9,
    name: "settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
  {
    id: 10,
    name: "track-order",
    icon: <LocalShippingOutlinedIcon />,
    path: "/track-order",
  },
];
