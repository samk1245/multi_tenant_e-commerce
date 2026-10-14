/**
 * Transactional Email & Notification Adapter
 */
class EmailAdapter {
  constructor() {
    this.smtpHost = process.env.SMTP_HOST || "";
    this.isSandbox = process.env.EMAIL_SANDBOX !== "false";
  }

  async sendOrderConfirmation(order) {
    const emailPayload = {
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNumber} - OmniStore Marketplace`,
      body: `Thank you for your order, ${order.customer.name}! Total: $${order.totalAmount.toFixed(2)}. Tracking: ${order.shippingDetails?.trackingNumber || "Assigned shortly"}`,
      sentAt: new Date().toISOString(),
      status: "delivered_sandbox",
    };

    if (process.env.NODE_ENV !== "test") {
      console.log(`📧 [EMAIL ADAPTER] Dispatched order confirmation to: ${order.customer.email} (Order #${order.orderNumber})`);
    }

    return emailPayload;
  }

  async sendOtp(email, code) {
    if (process.env.NODE_ENV !== "test") {
      console.log(`🔐 [EMAIL ADAPTER] Verification OTP ${code} dispatched to: ${email}`);
    }
    return { success: true, email, dispatchedAt: new Date().toISOString() };
  }
}

module.exports = new EmailAdapter();
