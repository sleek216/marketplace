import {
	getStoreIdFromRecord,
	hasManualExpectedDelivery,
	resolveManualExpectedDeliveryItem,
} from "./ManualExpectedDeliveryInfo";

export const resolveStoreLogo = (item, record) =>
	item?.store_logo_full_url ??
	record?.store_logo_full_url ??
	item?.store?.logo_full_url ??
	record?.store?.logo_full_url ??
	item?.store_details?.logo_full_url ??
	record?.store_details?.logo_full_url ??
	null;

export const groupItemsByStore = (items, resolveRecord = (item) => item) => {
	if (!Array.isArray(items) || items.length === 0) {
		return [];
	}

	const groups = [];
	const groupIndexByStoreId = new Map();

	items.forEach((item, index) => {
		const record = resolveRecord(item);
		const storeId =
			getStoreIdFromRecord(item) ??
			getStoreIdFromRecord(record) ??
			"__default__";

		if (!groupIndexByStoreId.has(storeId)) {
			const group = {
				storeId,
				storeName:
					item?.store_name ??
					record?.store_name ??
					item?.store?.name ??
					record?.store?.name,
				storeLogo: resolveStoreLogo(item, record),
				items: [],
				deliverySource: null,
			};
			groupIndexByStoreId.set(storeId, groups.length);
			groups.push(group);
		}

		const group = groups[groupIndexByStoreId.get(storeId)];
		group.items.push({ item, index, record });

		if (!group.deliverySource) {
			const deliveryItem = resolveManualExpectedDeliveryItem(record);
			if (hasManualExpectedDelivery(deliveryItem)) {
				group.deliverySource = item;
			}
		}

		if (!group.storeName) {
			group.storeName =
				item?.store_name ?? record?.store_name ?? item?.store?.name;
		}
		if (!group.storeLogo) {
			group.storeLogo = resolveStoreLogo(item, record);
		}
	});

	return groups;
};
