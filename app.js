const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chalk = require("chalk");
const figlet = require("figlet");

const app = express();

// Import the Flight model from the models directory
const { Flight, Ticket } = require("./models/flight"); // Adjust the path based on your project structure
console.log(Ticket);
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://Adham:MnZXCuGdkLGw8dEJ@cluster0.94gew.mongodb.net/flightDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log(chalk`{yellow DATABASE} : {green CONNECTED}`);
  })
  .catch((err) => {
    console.log(chalk.red("MongoDB Connection Error: ", err));
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));
app.use(
  session({
    secret: "VERYSECRETKEY",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/search", (req, res) => {
  const { pnr, lastName } = req.body;

  if (!pnr || !lastName) {
    return res.render("home", {
      error: "Both PNR and Last Name are required.",
    });
  }

  // Query the MongoDB database
  Flight.findOne({ pnr, lastName })
    .then((flight) => {
      if (flight) {
        res.render("flightDetails", { flight });
      } else {
        res.render("home", {
          error: "No flight found with the given PNR and Last Name.",
        });
      }
    })
    .catch((err) => {
      console.log(chalk.red("Error fetching flight data: ", err));
      res.render("home", {
        error: "An error occurred. Please try again later.",
      });
    });
});

app.post("/check-pnr", (req, res) => {
  const { pnr, lastName } = req.body;

  if (!pnr || !lastName) {
    return res.render("home", {
      error: "Both PNR and Last Name are required.",
    });
  }

  // Query the MongoDB database to find a matching flight
  Flight.findOne({ pnr, lastName })
    .then((flight) => {
      if (flight) {
        // If a flight is found, render the flight details page
        res.render("flightDetails", { flight });
      } else {
        // If no matching flight is found, return to the home page with an error
        res.render("home", {
          error: "No flight found with the given PNR and Last Name.",
        });
      }
    })
    .catch((err) => {
      console.log(chalk.red("Error fetching flight data: ", err));
      res.render("home", {
        error: "An error occurred. Please try again later.",
      });
    });
});

// Route to display all flights
app.get("/flights", (req, res) => {
  Ticket.find({})
    .then((Ticket) => {
      console.log(Ticket);
      res.render("flight", { Ticket, i: 0 }); // Pass the flights data to flight.ejs
    })
    .catch((err) => {
      console.log(chalk.red("Error fetching flights: ", err));
      res.status(500).send("Error fetching flights.");
    });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/submit-contact", (req, res) => {
  const { fullName, email, subject, message } = req.body;

  // Here, you can handle the form data (e.g., save to a database, send an email, etc.)
  console.log(chalk`{yellow CONTACT-FORM} : {green RECEIVED}`, {
    fullName,
    email,
    subject,
    message,
  });
  // Send a response back to the user (you can send a confirmation page or message)
  res.render("contact", {
    successMessage:
      "Thank you for contacting us! We will get back to you shortly.",
  });
});

// Listen
app.listen(3030, () => {
  console.clear();
  figlet(chalk`FLIGHT TERMINAL  :D`, function (err, data) {
    console.log(data);
    console.log(chalk`{yellow FLIGHT} : {green STABLE}`);
  });
});
