import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Mock Database for Dashboard Stats ──────────────────────────────────────────
const statsData = {
  crowdData: [
    { day: "Mon", pilgrims: 12400, forecast: 13000 },
    { day: "Tue", pilgrims: 15200, forecast: 15800 },
    { day: "Wed", pilgrims: 9800, forecast: 10200 },
    { day: "Thu", pilgrims: 18600, forecast: 19000 },
    { day: "Fri", pilgrims: 22400, forecast: 23100 },
    { day: "Sat", pilgrims: 31000, forecast: 32500 },
    { day: "Sun", pilgrims: 28700, forecast: 29400 },
  ],
  occupancyData: [
    { month: "Jan", occupied: 72, forecast: 76 },
    { month: "Feb", occupied: 68, forecast: 71 },
    { month: "Mar", occupied: 85, forecast: 88 },
    { month: "Apr", occupied: 91, forecast: 93 },
    { month: "May", occupied: 78, forecast: 80 },
    { month: "Jun", occupied: 95, forecast: 96 },
  ],
  travelDemandData: [
    { route: "Chennai", buses: 42, cars: 128, forecast: 185 },
    { route: "Bangalore", buses: 35, cars: 96, forecast: 142 },
    { route: "Hyderabad", buses: 28, cars: 84, forecast: 120 },
    { route: "Mumbai", buses: 18, cars: 62, forecast: 88 },
    { route: "Delhi", buses: 12, cars: 44, forecast: 62 },
  ],
  templeWeeklyData: [
    { week: "W1 Jun", actual: 142000, predicted: 148000, capacity: 160000 },
    { week: "W2 Jun", actual: 168000, predicted: 172000, capacity: 160000 },
    { week: "W3 Jun", actual: 155000, predicted: 158000, capacity: 160000 },
    { week: "W4 Jun", actual: 189000, predicted: 194000, capacity: 160000 },
  ]
};

// ─── Mock Database for Pilgrim Bookings & Actions ────────────────────────────────
let bookings = [
  {
    id: "TTD-772849",
    phone: "9876543210",
    name: "Venkatesh Prasad",
    darshanType: "Special Entry Darshan (₹300)",
    date: "2026-06-25",
    slot: "09:00 AM - 11:00 AM",
    status: "Confirmed",
    ticketsCount: 4,
    prasadamCount: 4,
    history: [
      { timestamp: new Date().toISOString(), message: "Booking created successfully." }
    ]
  },
  {
    id: "TTD-334928",
    phone: "8765432109",
    name: "Sita Kalyani",
    darshanType: "Sarvadarsanam (Free)",
    date: "2026-06-26",
    slot: "02:00 PM - 05:00 PM",
    status: "Confirmed",
    ticketsCount: 2,
    prasadamCount: 0,
    history: [
      { timestamp: new Date().toISOString(), message: "Booking created successfully." }
    ]
  },
  {
    id: "TTD-901842",
    phone: "7654321098",
    name: "Anil Kumar Reddy",
    darshanType: "VIP Break Darshan",
    date: "2026-06-24",
    slot: "06:00 AM - 08:00 AM",
    status: "Checked In",
    ticketsCount: 1,
    prasadamCount: 2,
    history: [
      { timestamp: new Date(Date.now() - 86400000).toISOString(), message: "Booking created successfully." },
      { timestamp: new Date().toISOString(), message: "Checked in at Vaikuntam Queue Complex." }
    ]
  }
];

// ─── API Routes ──────────────────────────────────────────────────────────────────

// Get dashboard statistics
app.get("/api/stats", (req, res) => {
  res.json(statsData);
});

// Search booking by phone number or booking ID
app.get("/api/bookings", (req, res) => {
  const { phone, id } = req.query;
  
  if (!phone && !id) {
    return res.status(400).json({ error: "Phone number or Booking ID is required" });
  }

  let booking = null;
  if (phone) {
    // strip out formatting just in case
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    booking = bookings.find(b => b.phone.replace(/[^0-9]/g, "").endsWith(cleanPhone) || cleanPhone.endsWith(b.phone.replace(/[^0-9]/g, "")));
  } else if (id) {
    booking = bookings.find(b => b.id.toLowerCase() === id.trim().toLowerCase());
  }

  if (!booking) {
    return res.status(404).json({ error: "No active booking found for the provided details." });
  }

  res.json(booking);
});

// Perform action on booking (Cancel, Reschedule, Update Prasadam)
app.post("/api/bookings/action", (req, res) => {
  const { id, action, date, slot, prasadamCount } = req.body;

  if (!id || !action) {
    return res.status(400).json({ error: "Booking ID and Action are required" });
  }

  const bookingIndex = bookings.findIndex(b => b.id === id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const booking = bookings[bookingIndex];

  if (booking.status === "Cancelled" || booking.status === "Checked In") {
    return res.status(400).json({ error: `Cannot perform actions on a ${booking.status} booking.` });
  }

  const timestamp = new Date().toISOString();

  switch (action) {
    case "cancel":
      booking.status = "Cancelled";
      booking.history.push({ timestamp, message: "Booking cancelled by user." });
      break;

    case "reschedule":
      if (!date || !slot) {
        return res.status(400).json({ error: "New Date and Slot are required for rescheduling." });
      }
      const oldDate = booking.date;
      const oldSlot = booking.slot;
      booking.date = date;
      booking.slot = slot;
      booking.history.push({ 
        timestamp, 
        message: `Rescheduled darshan from ${oldDate} (${oldSlot}) to ${date} (${slot}).` 
      });
      break;

    case "updatePrasadam":
      if (prasadamCount === undefined || prasadamCount < 0) {
        return res.status(400).json({ error: "Valid prasadam count is required." });
      }
      const oldPrasadam = booking.prasadamCount;
      booking.prasadamCount = prasadamCount;
      booking.history.push({ 
        timestamp, 
        message: `Updated pre-booked prasadam count from ${oldPrasadam} to ${prasadamCount}.` 
      });
      break;

    default:
      return res.status(400).json({ error: "Invalid action type." });
  }

  // Update in array
  bookings[bookingIndex] = booking;

  res.json({ message: "Action executed successfully", booking });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
