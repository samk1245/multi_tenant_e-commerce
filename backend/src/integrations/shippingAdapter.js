/**
 * Shipping & Delivery Adapter (Shiprocket / Logistics Engine)
 */
class ShippingAdapter {
  constructor() {
    this.apiKey = process.env.SHIPROCKET_API_KEY || "";
    this.isSandbox = process.env.SHIPPING_SANDBOX !== "false";
  }

  /**
   * Check pin/ZIP code serviceability & delivery estimates
   */
  checkPincodeServiceability(pincode) {
    const cleanPin = (pincode || "").toString().trim();
    if (!cleanPin) {
      return { serviceable: false, message: "Invalid pincode" };
    }

    const isMetro = ["10001", "10022", "90001", "560001", "110001", "400001"].some((p) =>
      cleanPin.startsWith(p.slice(0, 3))
    );

    const deliveryDays = isMetro ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);

    return {
      serviceable: true,
      pincode: cleanPin,
      carrier: isMetro ? "Express Prime Logistics" : "Standard Surface Carrier",
      estimatedDays: deliveryDays,
      estimatedDeliveryDate: estDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      codAvailable: true,
      freeDeliveryEligible: true,
    };
  }

  /**
   * Generate realistic tracking history for an order
   */
  getOrderTracking(order) {
    const createdAt = new Date(order.createdAt || Date.now());
    const trackingNumber = order.shippingDetails?.trackingNumber || `TRK-${order.orderNumber.replace(/[^0-9]/g, "").slice(-8)}`;

    const statuses = [
      {
        status: "confirmed",
        title: "Order Placed & Confirmed",
        description: "Seller has confirmed your order and is preparing the package.",
        time: new Date(createdAt.getTime() + 10 * 60 * 1000).toLocaleString(),
        completed: true,
      },
      {
        status: "processing",
        title: "Packed at Fulfillment Center",
        description: "Items packed securely with tamper-evident seal.",
        time: new Date(createdAt.getTime() + 4 * 3600 * 1000).toLocaleString(),
        completed: ["processing", "shipped", "out_for_delivery", "delivered"].includes(order.orderStatus),
      },
      {
        status: "shipped",
        title: "Shipped & In Transit",
        description: "Carrier has received the package. In transit to destination hub.",
        time: new Date(createdAt.getTime() + 24 * 3600 * 1000).toLocaleString(),
        completed: ["shipped", "out_for_delivery", "delivered"].includes(order.orderStatus),
      },
      {
        status: "out_for_delivery",
        title: "Out for Delivery",
        description: "Courier executive is en route with your delivery.",
        time: new Date(createdAt.getTime() + 48 * 3600 * 1000).toLocaleString(),
        completed: ["out_for_delivery", "delivered"].includes(order.orderStatus),
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Package handed over directly to the recipient.",
        time: new Date(createdAt.getTime() + 52 * 3600 * 1000).toLocaleString(),
        completed: order.orderStatus === "delivered",
      },
    ];

    return {
      trackingNumber,
      carrier: order.shippingDetails?.carrier || "Express Prime Logistics",
      currentStatus: order.orderStatus,
      estimatedDelivery: order.shippingDetails?.estimatedDelivery || "3-5 Business Days",
      steps: statuses,
    };
  }
}

module.exports = new ShippingAdapter();
