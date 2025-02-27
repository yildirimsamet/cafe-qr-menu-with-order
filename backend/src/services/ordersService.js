import { getActiveOrderIdByTableSlug, createOrderGroup, addOrderItem, createOrder } from '../routes/customerRoute.js';

export const saveOrderToDatabase = async (orderData) => {
    const { table_slug, items, order_note } = orderData;

    try {
        // Get or create active order for the table
        const activeOrder = await getActiveOrderIdByTableSlug(table_slug);
        let order_id;

        if (activeOrder.length > 0) {
            order_id = activeOrder[0].id;
        } else {
            const newOrder = await createOrder(table_slug);
            order_id = newOrder.insertId;
        }

        // Create a new order group
        const orderGroup = await createOrderGroup({order_id, note: order_note});
        const order_group_id = orderGroup.insertId;

        // Add items to the order group
        for (const item of items) {
            const { item_id, size_id, quantity } = item;
            await addOrderItem(order_group_id, item_id, size_id, quantity);
        }

        return { status: 'success' };
    } catch (error) {
        console.error('Error saving order to database:', error);
        return { status: 'error', message: error.message };
    }
};

