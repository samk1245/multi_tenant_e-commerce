import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, HelpCircle, FileText, CheckCircle2, ChevronDown, ChevronUp, Sparkles, PhoneCall, ShieldCheck, Tag } from 'lucide-react';
import { api } from '../api';

const FAQ_ITEMS = [
  {
    q: "How can I track my order delivery?",
    a: "You can track your live shipment at any time by opening your Profile > My Orders, or by typing your Order ID (e.g. ORD-94821-IN) right here in this chat!",
    cat: "Delivery",
  },
  {
    q: "What is the return and refund policy?",
    a: "We offer a 7-day hassle-free return window for all items. Simply request a return through support or your profile; our courier will pick it up and refund your money within 24 hours of inspection.",
    cat: "Returns",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and Net Banking across all Indian banks with 256-bit SSL encryption.",
    cat: "Payment",
  },
  {
    q: "How do I unlock free express shipping?",
    a: "Orders above ₹999 automatically qualify for 100% Free Express Delivery across India. For orders below ₹999, a flat delivery fee of ₹99 applies.",
    cat: "Delivery",
  },
  {
    q: "What promo discount coupons are currently active?",
    a: "Currently active codes: 'FESTIVE20' (Flat 20% OFF on orders over ₹2,499), 'VIP15' (15% OFF for members), and 'DROP10' (10% instant discount).",
    cat: "Coupons",
  },
];

export default function SupportWidget({ activeTenant, onOpenOrders }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'faq' | 'ticket'
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! 🙏 Welcome to OmniStore Customer Support. I'm your 24/7 AI shopping assistant. How can I help you today?",
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    name: 'Rahul Verma',
    email: 'customer@example.com',
    category: 'Order & Shipping',
    orderNumber: '',
    subject: '',
    message: '',
  });
  const [ticketSuccess, setTicketSuccess] = useState(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm here to assist you! For detailed order inquiries, please provide your Order Number (e.g., ORD-94821-IN) or submit a ticket in the 'Submit Ticket' tab.";
      const lower = query.toLowerCase();

      if (lower.includes('order') || lower.includes('track') || lower.includes('delivery') || lower.includes('ord-')) {
        botResponse = "📦 Orders are dispatched within 24 hours via Express Air (BlueDart / Delhivery). You can view full tracking timelines and AWB numbers in your Profile > My Orders tab!";
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('offer') || lower.includes('promo')) {
        botResponse = "🎉 Active Festive Offers: Use code 'FESTIVE20' for 20% OFF on orders over ₹2,499! You can also use 'VIP15' for 15% OFF or 'DROP10' for 10% OFF.";
      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
        botResponse = "🔄 We offer a 7-day hassle-free return guarantee! Return pickup is free of cost, and refunds are credited back via UPI / original method within 24 hours.";
      } else if (lower.includes('payment') || lower.includes('cod') || lower.includes('upi') || lower.includes('cash')) {
        botResponse = "💳 We support all major payment modes: Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm), and Credit/Debit cards with zero extra fees.";
      } else if (lower.includes('store') || lower.includes('fashion') || lower.includes('sneaker') || lower.includes('coffee') || lower.includes('tech')) {
        botResponse = `✨ You are currently browsing ${activeTenant?.name || 'our multi-tenant catalog'}. You can switch between our 5 stores (Sneakers, Minimalist Decor, Artisan Coffee, Audio Tech, Haute Couture) via the 'Switch Store' menu in the navbar!`;
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('contact') || lower.includes('call')) {
        botResponse = "📞 You can speak with our executive team Mon-Sat (9 AM - 9 PM) at +91 1800-419-8900, or submit a support ticket right here in the 'Submit Ticket' tab for 2-hour resolution.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      alert("Please enter subject and message.");
      return;
    }

    setSubmittingTicket(true);
    try {
      const res = await api.createTicket(ticketForm);
      if (res.success) {
        setTicketSuccess(res.data);
        setTicketForm({
          name: 'Rahul Verma',
          email: 'customer@example.com',
          category: 'Order & Shipping',
          orderNumber: '',
          subject: '',
          message: '',
        });
      } else {
        alert(res.message || "Failed to create ticket");
      }
    } catch (err) {
      alert("Error submitting ticket: " + err.message);
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Launcher Pill / Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-neutral-950 font-black text-xs shadow-2xl hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 fill-neutral-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <span>Support & AI Help</span>
        </button>
      )}

      {/* Support Modal Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] rounded-3xl bg-neutral-900 border border-neutral-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-neutral-950 via-emerald-950/60 to-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-sm">OmniSupport AI Desk</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-neutral-400">24/7 Verified Support Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950/70 px-3 pt-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'faq'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('ticket')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'ticket'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>

          {/* TAB 1: AI CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-neutral-950/40">
              
              {/* Quick Query Suggestion Pills */}
              <div className="px-3 py-2 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-neutral-950/60">
                <button
                  onClick={() => handleSendMessage("Track my order delivery")}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/40 whitespace-nowrap transition cursor-pointer"
                >
                  📦 Track Order
                </button>
                <button
                  onClick={() => handleSendMessage("What coupons are available?")}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/40 whitespace-nowrap transition cursor-pointer"
                >
                  🎉 Coupons
                </button>
                <button
                  onClick={() => handleSendMessage("What is the return policy?")}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/40 whitespace-nowrap transition cursor-pointer"
                >
                  🔄 Returns
                </button>
                <button
                  onClick={() => handleSendMessage("Do you accept Cash on Delivery?")}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/40 whitespace-nowrap transition cursor-pointer"
                >
                  💳 Payment
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-500 text-neutral-950 font-bold rounded-tr-none'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`text-[9px] block mt-1 text-right ${
                          m.sender === 'user' ? 'text-neutral-900/70' : 'text-neutral-500'
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-neutral-500 text-xs pl-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>AI Assistant is typing...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about orders, shipping, coupons..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: FAQS */}
          {activeTab === 'faq' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Frequently Asked Questions
                </h4>
                <p className="text-[11px] text-neutral-500">Quick answers to our most common shopping inquiries.</p>
              </div>

              {FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-950/60 border border-neutral-800/90 overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between gap-2 hover:text-emerald-400 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === idx && (
                    <div className="px-3.5 pb-3.5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center text-xs">
                <p className="text-neutral-400">Still have a question?</p>
                <button
                  onClick={() => setActiveTab('ticket')}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition cursor-pointer"
                >
                  Submit a Support Ticket
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT SUPPORT TICKET */}
          {activeTab === 'ticket' && (
            <div className="flex-1 overflow-y-auto p-4">
              {ticketSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-white">Ticket Submitted!</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Your request has been forwarded to our support desk. A specialist will reply within 2-4 hours.
                  </p>
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-emerald-400 font-bold">
                    Reference ID: {ticketSuccess.ticketNumber}
                  </div>
                  <button
                    onClick={() => setTicketSuccess(null)}
                    className="mt-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Submit Official Support Ticket
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Guaranteed response within 2-4 business hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Your Name</label>
                      <input
                        type="text"
                        required
                        value={ticketForm.name}
                        onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Email</label>
                      <input
                        type="email"
                        required
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option>Order & Shipping</option>
                        <option>Returns & Refund</option>
                        <option>Payment & Billing</option>
                        <option>Product Inquiry</option>
                        <option>Technical Issue</option>
                        <option>General Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Order ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. ORD-94821-IN"
                        value={ticketForm.orderNumber}
                        onChange={(e) => setTicketForm({ ...ticketForm, orderNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Detailed Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Explain how we can help you in detail..."
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-xs transition cursor-pointer"
                  >
                    {submittingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
