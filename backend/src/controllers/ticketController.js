const Ticket = require("../models/Ticket");

// @desc    Submit new support ticket
// @route   POST /api/tickets
exports.createTicket = async (req, res, next) => {
  try {
    const { name, email, phone, category, orderNumber, subject, message, priority } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, subject, and detailed message",
      });
    }

    const ticketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}-IN`;

    const ticket = await Ticket.create({
      ticketNumber,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      category: category || "General Support",
      orderNumber: orderNumber ? orderNumber.trim() : "",
      subject: subject.trim(),
      message: message.trim(),
      priority: priority || "medium",
      status: "open",
      responses: [
        {
          sender: "system",
          message: `Ticket ${ticketNumber} received. A support specialist has been assigned and will reply within 2-4 business hours.`,
          createdAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: `Support ticket ${ticketNumber} created successfully`,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user support tickets
// @route   GET /api/tickets
exports.getTickets = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.email) {
      filter.email = req.query.email.trim().toLowerCase();
    }
    if (req.query.ticketNumber) {
      filter.ticketNumber = req.query.ticketNumber.trim();
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
