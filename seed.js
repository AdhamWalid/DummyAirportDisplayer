const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker"); // Correctly importing faker
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://Adham:MnZXCuGdkLGw8dEJ@cluster0.94gew.mongodb.net/flightDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the ticket schema and model
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

const Ticket = mongoose.model("Ticket", ticketSchema);

// Generate random mock data
const generateRandomTicket = () => {
  return {
    flightNumber: faker.airline.flightNumber(), // Correct method to generate random 6-character flight number
    airline: faker.company.name(), // Random company name as airline
    departureAirport: `${faker.airline.airport().name} Airport`, // Random departure airport
    arrivalAirport: `${faker.airline.airport().name} Airport`, // Random arrival airport
    departureTime: faker.date.soon(), // Random soon future date for departure
    arrivalTime: faker.date.soon(), // Random soon future date for arrival
    status: faker.helpers.arrayElement([
      "Scheduled",
      "Delayed",
      "Cancelled",
      "Landed",
    ]), // Random status
    price: parseFloat(faker.commerce.price(100, 1000, 2)), // Random price between 100 and 1000
    availableSeats: faker.number.int({ min: 50, max: 300 }), // Random number of available seats
  };
};

// Insert multiple random tickets into MongoDB
const insertRandomTickets = async (num) => {
  try {
    const tickets = Array.from({ length: num }, generateRandomTicket); // Generate random tickets
    const result = await Ticket.insertMany(tickets); // Insert into MongoDB
    console.log(`${result.length} random tickets inserted successfully!`);
  } catch (err) {
    console.error("Error inserting random tickets:", err);
  } finally {
    mongoose.connection.close(); // Close connection after insertion
  }
};

// Insert 10 random tickets
insertRandomTickets(100);
