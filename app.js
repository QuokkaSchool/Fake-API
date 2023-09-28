const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors()); // use cors

const port = 8080;

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const clients = [
  {
    id: "e5c51fd6-a266-4e07-a266-270cf99c3b43",
    name: "Jan",
    surname: "Kowalski",
    number: "333-444-555",
    email: "jan.kowalski@gmail.com",
  },
  {
    id: "f5c51fd6-7536-4e07-a266-350cf89c3b21",
    name: "Kamil",
    surname: "Świątek",
    number: "641-107-616",
    email: "kamil.swiatek@gmail.com",
  },
  {
    id: "1c5eaccc-7b6e-41f7-99dd-8a5a3a9d56a5",
    name: "Anna",
    surname: "Kowalska",
    number: "123-456-789",
    email: "anna.kowalska@gmail.com",
  },
  {
    id: "34d149b8-8bf7-4d63-81f6-5e1cfc6fbab2",
    name: "Michał",
    surname: "Nowak",
    number: "555-555-555",
    email: "michal.nowak@gmail.com",
  },
  {
    id: "f6f0d99b-5639-4f0e-b9e9-9c19a0a2c2e0",
    name: "Magdalena",
    surname: "Lis",
    number: "987-654-321",
    email: "magdalena.lis@gmail.com",
  },
  {
    id: "b0d2104a-336e-4a46-af18-3a0b6884772c",
    name: "Piotr",
    surname: "Wójcik",
    number: "111-222-333",
    email: "piotr.wojcik@gmail.com",
  },
  {
    id: "8f0e53a1-2e23-4520-8f2c-6ef7d6cc6aa7",
    name: "Ewa",
    surname: "Szymańska",
    number: "777-888-999",
    email: "ewa.szymanska@gmail.com",
  },
  {
    id: "d71f88b2-9a2b-4d9d-b33d-87c6f7477a72",
    name: "Jakub",
    surname: "Dąbrowski",
    number: "444-333-222",
    email: "jakub.dabrowski@gmail.com",
  },
  {
    id: "a0b3c0d4-5e95-4d01-9982-7217e8a38ed6",
    name: "Natalia",
    surname: "Kaczmarek",
    number: "123-987-456",
    email: "natalia.kaczmarek@gmail.com",
  },
  {
    id: "e0f1a2b3-4c5d-6e7f-8a9b-1c2d3e4f5a6d",
    name: "Łukasz",
    surname: "Grabowski",
    number: "555-123-789",
    email: "lukasz.grabowski@gmail.com",
  },
  {
    id: "2a1b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Alicja",
    surname: "Pawlak",
    number: "987-654-321",
    email: "alicja.pawlak@gmail.com",
  },
];
const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  number: z.string().regex(phoneRegex, "Invalid Number!"),
  email: z.string().email(),
});
const updateClientSchema = z.object({
  name: z.string(),
  surname: z.string(),
  number: z.string().regex(phoneRegex, "Invalid Number!"),
  email: z.string().email(),
});

const vehicles = [];
const vehicleSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  pricePerHour: z.number(),
  valueOfCar: z.number(),
});
const updateVehicleSchema = z.object({
  brand: z.string(),
  model: z.string(),
  pricePerHour: z.number(),
  valueOfCar: z.number(),
});

app.use(express.json());

const ROUTES = {
  clients: "/api/clients",
  vehicles: "/api/vehicles",
};

// ------------------------
// |       Clients        |
// ------------------------
// Read all
app.get(ROUTES.clients, (req, res) => {
  res.json(clients);
});

// Read single
app.get(`${ROUTES.clients}/:id`, (req, res) => {
  const data = clients.find((item) => item.id === req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "Client not found" });
  }
});

// Create
app.post(`${ROUTES.clients}/add`, (req, res) => {
  try {
    const inputData = clientSchema.parse({
      id: uuidv4(),
      ...req.body,
    });
    clients.push(inputData);
    res.status(201).json({ message: "Client added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update
app.put(`${ROUTES.clients}/update/:id`, (req, res) => {
  const id = req.params.id;
  const index = clients.findIndex((item) => item.id === id);
  if (index !== -1) {
    try {
      const inputData = updateClientSchema.parse(req.body);
      clients[index] = { id, ...inputData };
      res.json({ message: "Client updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ message: "Client not found" });
  }
});

// Delete
app.delete(`${ROUTES.clients}/delete/:id`, (req, res) => {
  const index = clients.findIndex((item) => item.id === req.params.id);
  if (index !== -1) {
    clients.splice(index, 1);
    res.json({ message: "Client deleted successfully" });
  } else {
    res.status(404).json({ message: "Client not found" });
  }
});

// ------------------------
// |       Vehicles       |
// ------------------------
// Read all
app.get(ROUTES.vehicles, (req, res) => {
  res.json(vehicles);
});

// Read single
app.get(`${ROUTES.vehicles}/:id`, (req, res) => {
  const data = vehicles.find((item) => item.id === req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "Vehicle not found" });
  }
});

// Create
app.post(`${ROUTES.vehicles}/add`, (req, res) => {
  try {
    const inputData = vehicleSchema.parse({
      id: uuidv4(),
      ...req.body,
    });
    vehicles.push(inputData);
    res.status(201).json({ message: "Vehicle added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update
app.put(`${ROUTES.vehicles}/update/:id`, (req, res) => {
  const id = req.params.id;
  const index = vehicles.findIndex((item) => item.id === req.params.id);
  if (index !== -1) {
    try {
      const inputData = updateVehicleSchema.parse(req.body);
      vehicles[index] = { id, ...inputData };
      res.json({ message: "Vehicle updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ message: "Vehicle not found" });
  }
});

// Delete
app.delete(`${ROUTES.vehicles}/delete/:id`, (req, res) => {
  const index = vehicles.findIndex((item) => item.id === req.params.id);
  if (index !== -1) {
    vehicles.splice(index, 1);
    res.json({ message: "Vehicle deleted successfully" });
  } else {
    res.status(404).json({ message: "Vehicle not found" });
  }
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
