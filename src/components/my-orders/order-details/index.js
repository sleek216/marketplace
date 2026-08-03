import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useGetOrderDetails from "../../../api-manage/hooks/react-query/order/useGetOrderDetails";
import useGetTrackOrderData from "../../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import OtherOrder from "./other-order";
import { getGuestId } from "helper-functions/getToken";
import { useSelector } from "react-redux";
import PushNotificationLayout from "../../PushNotificationLayout";
import {
  createReverbEcho,
  getReverbEchoInstance,
  setReverbEchoInstance,
} from "utils/reverbEcho";

const OrderDetails = ({ configData, id, page }) => {
  const router = useRouter();
  const guestId = getGuestId();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const phone = guestUserInfo?.contact_person_number;
  const {
    refetch,
    data,
    isRefetching,
    isLoading: dataIsLoading,
  } = useGetOrderDetails(id, guestId);
  const { refetch: refetchTrackOrder, data: trackOrderData } =
    useGetTrackOrderData(id, phone, guestId);
  useEffect(() => {
    refetch();
    refetchTrackOrder();
  }, [id]);

  useEffect(() => {
    if (!id || !configData) return;

    let echoInstance = getReverbEchoInstance();
    if (!echoInstance) {
      echoInstance = createReverbEcho(configData);
      if (echoInstance) {
        setReverbEchoInstance(echoInstance);
      }
    }

    if (echoInstance) {
      const channelName = `orders.${id}`;
      // Subscribe to private channel
      const privateChannel = echoInstance.private(channelName);
      const handleUpdate = (e) => {
        console.log("WebSocket event received (private):", e);
        refetch();
        refetchTrackOrder();
      };
      
      privateChannel.listen("OrderStatusUpdated", handleUpdate);
      privateChannel.listen("OrderUpdated", handleUpdate);
      privateChannel.listen("StatusUpdated", handleUpdate);

      // Subscribe to public channel as fallback
      const publicChannel = echoInstance.channel(channelName);
      const handlePublicUpdate = (e) => {
        console.log("WebSocket event received (public):", e);
        refetch();
        refetchTrackOrder();
      };
      publicChannel.listen("OrderStatusUpdated", handlePublicUpdate);
      publicChannel.listen("OrderUpdated", handlePublicUpdate);
      publicChannel.listen("StatusUpdated", handlePublicUpdate);

      // Also listen to secondary event names or just any bound events using pusher
      try {
        if (privateChannel.subscription) {
          privateChannel.subscription.bind_global((eventName, data) => {
            console.log("Pusher event bound_global (private):", eventName, data);
            refetch();
            refetchTrackOrder();
          });
        }
        if (publicChannel.subscription) {
          publicChannel.subscription.bind_global((eventName, data) => {
            console.log("Pusher event bound_global (public):", eventName, data);
            refetch();
            refetchTrackOrder();
          });
        }
      } catch (err) {
        console.warn("Could not bind Pusher global listener:", err);
      }

      return () => {
        privateChannel.stopListening("OrderStatusUpdated");
        privateChannel.stopListening("OrderUpdated");
        privateChannel.stopListening("StatusUpdated");
        publicChannel.stopListening("OrderStatusUpdated");
        publicChannel.stopListening("OrderUpdated");
        publicChannel.stopListening("StatusUpdated");
        echoInstance.leave(channelName);
        echoInstance.leave(`private-${channelName}`);
      };
    }
  }, [id, configData]);

  return (
    <div>
      <PushNotificationLayout
        refetchTrackOrder={refetchTrackOrder}
        pathName="profile"
      >
        <OtherOrder
          configData={configData}
          data={data}
          refetch={refetch}
          id={id}
          dataIsLoading={dataIsLoading}
          page={page}
        />
      </PushNotificationLayout>
    </div>
  );
};

OrderDetails.propTypes = {};

export default OrderDetails;
