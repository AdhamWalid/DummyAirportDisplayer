const mongoose = require("mongoose");

// Define the schema for the flight data
const flightSchema = new mongoose.Schema({
  pnr: {
    type: String,
    required: true,
    unique: true, // Ensures that the PNR is unique
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  seatClass: {
    type: String,
    enum: ["Economy", "Business", "First Class"],
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Booked", "Checked-in", "Cancelled"],
    default: "Booked",
  },
  baggageAllowance: {
    type: String,
    default: "1 checked bag, 1 carry-on",
  },
  contactInfo: {
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Paid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Delayed", "Cancelled", "Landed"],
    default: "Scheduled",
  },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

const Ticket = mongoose.model("tickets", ticketSchema);

// Create and export the Flight model based on the schema
const Flight = mongoose.model("Flight", flightSchema);

module.exports = { Flight, Ticket };
