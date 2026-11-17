import express from 'express';

const app = express();
const PORT = 4000;
app.use(express.json());

let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAZ5678", type: "Sedan", price: 1200000 },
    { id: 3, vehicleName: "Royal Enfield Classic 350", vehicleNumber: "UP16XY9876", type: "Bike", price: 215000 }
];

app.get('/vehicles', (req, res) => res.status(200).json(vehicles));

app.get('/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.status(200).json(vehicle);
});

app.post('/vehicles', (req, res) => {
    const { id, vehicleName, vehicleNumber, type, price } = req.body;
    if (id === undefined || !vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Missing required fields or price is not a positive number." });
    }
    const newVehicle = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(newVehicle);
    res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
});

app.put('/vehicles/:id', (req, res) => {
    const idx = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Vehicle not found" });
    const { vehicleName, vehicleNumber, type, price } = req.body;
    if (!vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Missing required fields or price is not a positive number." });
    }
    vehicles[idx] = { id: parseInt(req.params.id), vehicleName, vehicleNumber, type, price };
    res.status(200).json({ message: "Vehicle updated successfully", vehicle: vehicles[idx] });
});

app.delete('/vehicles/:id', (req, res) => {
    const idx = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Vehicle not found" });
    const deleted = vehicles.splice(idx, 1)[0];
    res.status(200).json({ message: "Vehicle deleted successfully", vehicle: deleted });
});

app.listen(PORT, () => console.log(`Express Server running at http://localhost:${PORT}`));
