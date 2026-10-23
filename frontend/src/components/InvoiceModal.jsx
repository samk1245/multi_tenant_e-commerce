import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function InvoiceModal({ isOpen, onClose, order, tenant }) {
  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${order.orderNumber ? order.orderNumber.replace('ORD-', '') : Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const subtotal = order.subtotal || order.totalAmount || 0;
  const discount = order.discount || 0;
  const shipping = order.shipping || 0;
  const taxable = Math.max(0, subtotal - discount);
  const cgst = Math.round(taxable * 0.09 * 100) / 100;
  const sgst = Math.round(taxable * 0.09 * 100) / 100;
  const grandTotal = order.totalAmount || (taxable + cgst + sgst + shipping);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Tax Invoice & Receipt
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold ml-2">
              #{invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Print official tax invoice"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet Container */}
        <div id="printable-tax-invoice" className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs bg-neutral-950">
          
          {/* Header & Seller/Buyer Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tenant?.logo || '🛍️'}</span>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {tenant?.name || 'OmniStore India Ltd.'}
                </h2>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                OmniStore Enterprise Cloud Fulfillment Hub, BKC, Mumbai 400051<br />
                GSTIN: <span className="font-mono text-neutral-300 font-semibold">27AABCU9603R1ZM</span> &bull; State: Maharashtra (27)<br />
                CIN: U72900MH2026PTC392810 &bull; Support: support@omnistore.in
              </p>
            </div>

            <div className="text-left sm:text-right bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800 min-w-[200px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ORIGINAL FOR RECIPIENT
              </div>
              <div className="text-base font-black text-white mt-0.5">
                TAX INVOICE
              </div>
              <div className="mt-1 text-neutral-400 text-[11px] space-y-0.5">
                <div>Invoice No: <span className="font-mono font-bold text-white">{invoiceNumber}</span></div>
                <div>Date: <span className="font-bold text-neutral-200">{invoiceDate}</span></div>
                <div>Order Ref: <span className="font-mono text-neutral-300 font-semibold">{order.orderNumber}</span></div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Address Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                Billed To (Customer):
              </span>
              <div className="font-bold text-white text-sm">
                {order.customer?.name || 'Verified Customer'}
              </div>
              <div className="text-neutral-400 mt-1 leading-relaxed text-[11px]">
                {order.customer?.address?.street || order.customer?.street || '100 Marine Drive'}<br />
                {order.customer?.address?.city || order.customer?.city || 'Mumbai'}, {order.customer?.address?.state || order.customer?.state || 'Maharashtra'} - {order.customer?.address?.zip || order.customer?.zip || '400050'}<br />
                Phone: <span className="text-neutral-300">{order.customer?.phone || '+91 91234 56789'}</span><br />
                Email: <span className="text-neutral-300">{order.customer?.email || 'customer@example.com'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                Shipping & Courier Logistics:
              </span>
              <div className="font-bold text-white text-sm">
                {order.shippingDetails?.carrier || 'Delhivery Surface Prime'}
              </div>
              <div className="text-neutral-400 mt-1 leading-relaxed text-[11px]">
                Tracking AWB: <span className="font-mono font-bold text-emerald-400">{order.shippingDetails?.trackingNumber || 'DLV94028472IN'}</span><br />
                Payment Method: <span className="uppercase font-bold text-white">{order.paymentMethod || 'Online UPI'}</span><br />
                Payment Status: <span className="uppercase text-emerald-400 font-bold">PAID (VERIFIED)</span><br />
                Estimated Delivery: <span className="text-neutral-300">{order.shippingDetails?.estimatedDelivery || '2-4 Business Days'}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Goods</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable Amt</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {(order.items || []).map((item, idx) => {
                  const lineTotal = (item.price || 0) * (item.quantity || 1);
                  return (
                    <tr key={idx} className="hover:bg-neutral-900/40 transition">
                      <td className="py-2.5 px-3 text-neutral-500 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[10px] text-neutral-500">SKU: OMS-{item.productId?.slice(-6) || '847291'}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-400">640411</td>
                      <td className="py-2.5 px-3 text-right text-neutral-300 font-mono">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-white font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-neutral-300">
                        {formatCurrency(lineTotal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white font-mono">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown & Digital Seal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Left Terms & Authentication */}
            <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Declaration & Terms:
                </span>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  1. We declare that this invoice shows the actual price of goods and that all particulars are true and correct.<br />
                  2. All goods sold are covered under OmniStore 7-day unconditional replacement & manufacturer guarantee.<br />
                  3. This is a computer-generated tax invoice and requires no physical ink signature.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-bold text-white uppercase">Digitally Certified</div>
                    <div className="text-[9px] text-neutral-500 font-mono">HASH: 8f9b2...e41a</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-neutral-400">Authorized Signatory</div>
                  <div className="text-[11px] font-black text-emerald-400 font-serif italic">OmniStore Systems</div>
                </div>
              </div>
            </div>

            {/* Right Financial Calculations */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Items Subtotal:</span>
                <span className="font-mono text-neutral-200">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon & Offers Discount ({order.couponCode || 'APPLIED'}):</span>
                  <span className="font-mono font-bold">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>CGST (9.0%):</span>
                <span className="font-mono text-neutral-200">{formatCurrency(cgst)}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>SGST (9.0%):</span>
                <span className="font-mono text-neutral-200">{formatCurrency(sgst)}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Shipping & Express Handling:</span>
                <span className="font-mono text-neutral-200">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatCurrency(shipping)}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm">
                <span className="font-black text-white">Grand Total Invoiced:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
