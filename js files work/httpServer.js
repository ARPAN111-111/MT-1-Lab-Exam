import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let vehicles = [
    { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
    { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAZ5678", type: "Sedan", price: 1200000 }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Vehicle Management Web Application</h1>');
    } else if (method === 'GET' && url === '/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles, null, 2));
    } else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>About Vehicle Management Application</h2><p>Built with Node.js HTTP & FS modules.</p>');
    } else if (method === 'GET' && url === '/info') {
        const filePath = path.join(__dirname, 'public', 'info.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal Server Error: Unable to read info.html" }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (method === 'POST' && url === '/add-vehicle') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { id, vehicleName, vehicleNumber, type, price } = JSON.parse(body);
                if (id === undefined || !vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Missing required fields or invalid price." }));
                    return;
                }
                vehicles.push({ id, vehicleName, vehicleNumber, type, price });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Vehicle added successfully", vehicle: { id, vehicleName, vehicleNumber, type, price } }));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON payload" }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "404 Route Not Found" }));
    }
});

server.listen(PORT, () => console.log(`HTTP Server running at http://localhost:${PORT}`));
