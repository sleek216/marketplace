import { Toaster } from "react-hot-toast";
import { APP_MARKETPLACE_FONT } from "../theme/app-typography";

const AppToaster = () => (
  <Toaster
    position="bottom-right"
    gutter={12}
    containerStyle={{
      bottom: 20,
      right: 20,
    }}
    toastOptions={{
      duration: 4500,
      style: {
        fontFamily: APP_MARKETPLACE_FONT,
        borderRadius: "12px",
        boxShadow:
          "0 10px 40px -10px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)",
        padding: "12px 16px",
        maxWidth: "min(380px, calc(100vw - 40px))",
      },
    }}
  />
);

export default AppToaster;
