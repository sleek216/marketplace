/**
 * Groups customer order list entries that share the same checkout_group_id
 * (multi-store checkout). Orders without a group id stay as singles.
 */
export const groupOrdersByCheckoutGroup = (orders) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const byGroup = new Map();
  orders.forEach((order) => {
    const raw = order?.checkout_group_id;
    const key =
      raw != null && String(raw).trim() !== "" ? String(raw).trim() : null;
    if (!key) return;
    if (!byGroup.has(key)) {
      byGroup.set(key, []);
    }
    byGroup.get(key).push(order);
  });

  const emittedGroups = new Set();
  const result = [];

  orders.forEach((order) => {
    const raw = order?.checkout_group_id;
    const key =
      raw != null && String(raw).trim() !== "" ? String(raw).trim() : null;

    if (!key) {
      result.push({ type: "single", order });
      return;
    }

    if (emittedGroups.has(key)) {
      return;
    }
    emittedGroups.add(key);

    const groupOrders = byGroup.get(key) || [order];
    if (groupOrders.length > 1) {
      result.push({
        type: "group",
        checkoutGroupId: key,
        orders: groupOrders,
      });
    } else {
      result.push({ type: "single", order });
    }
  });

  return result;
};

export const getCheckoutGroupGrandTotal = (orders) =>
  (orders || []).reduce(
    (sum, order) => sum + (Number(order?.order_amount) || 0),
    0
  );
