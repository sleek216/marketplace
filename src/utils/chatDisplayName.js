/** Display name for a chat participant (vendor store, delivery man, etc.). */
export function getParticipantDisplayName(participant, options = {}) {
  const { participantType, fallback = "" } = options;
  if (!participant) return fallback;

  const type = `${participantType ?? participant?.type ?? ""}`.toLowerCase();
  const isVendor =
    type === "vendor" ||
    participant?.vendor_id != null ||
    participant?.store_id != null;

  if (isVendor) {
    const storeName =
      participant.name ??
      participant.store_name ??
      participant.shop_name ??
      participant.store?.name;
    if (storeName && `${storeName}`.trim()) {
      return `${storeName}`.trim();
    }
  }

  const fullName = [
    participant.f_name ?? participant.first_name,
    participant.l_name ?? participant.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;

  const singleName = participant.name ?? participant.store_name;
  return singleName ? `${singleName}`.trim() : fallback;
}

/** Partner name shown in inbox list and conversation header. */
export function getConversationPartnerName(conversation, configData) {
  if (!conversation) return "";

  if (conversation.receiver_type === "admin") {
    return (
      getParticipantDisplayName(conversation.receiver, {
        participantType: "admin",
        fallback: configData?.business_name ?? "Admin",
      }) ||
      configData?.business_name ||
      "Admin"
    );
  }

  const isCustomerSender = conversation.sender_type === "customer";
  const partner = isCustomerSender ? conversation.receiver : conversation.sender;
  const partnerType = isCustomerSender
    ? conversation.receiver_type
    : conversation.sender_type;

  return getParticipantDisplayName(partner, {
    participantType: partnerType,
    fallback: configData?.business_name ?? "",
  });
}

/** Merge fresh conversation metadata from the details API into channel-list state. */
export function mergeConversationFromDetails(cached, details) {
  if (!details) return cached;
  if (!cached) return details;

  return {
    ...cached,
    ...details,
    receiver: { ...(cached.receiver ?? {}), ...(details.receiver ?? {}) },
    sender: { ...(cached.sender ?? {}), ...(details.sender ?? {}) },
  };
}

/** Find a channel row matching the active conversation. */
export function findChannelConversation(channelList, { channelId, receiverType }) {
  if (!Array.isArray(channelList) || !channelId) return null;

  if (channelId === "admin" || receiverType === "admin") {
    return channelList.find((item) => item.receiver_type === "admin") ?? null;
  }

  return (
    channelList.find((item) => String(item.id) === String(channelId)) ?? null
  );
}
