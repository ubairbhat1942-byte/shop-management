const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (Simulating a database)
let inventory = [
    { id: 1, name: 'Galaxy S24', brand: 'Samsung', category: 'phones', price: '74999' },
    { id: 2, name: 'Airdopes 141', brand: 'boAt', category: 'earphones', price: '1299' },
    { id: 3, name: 'Platini Room Heater', brand: 'Bajaj', category: 'electronics', price: '2499' }
];

let repairs = [
    { ticketId: 'R-101', customerName: 'Amit', phone: '9876543210', status: 'In Progress', device: 'Vivo V30' }
];

// --- API ENDPOINTS ---

// 1. Get all inventory items
app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

// 2. Add a new item (Shopkeeper Route)
app.post('/api/inventory', (req, res) => {
    const { name, brand, category, price } = req.body;
    if (!name || !brand || !category || !price) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const newItem = { id: inventory.length + 1, name, brand, category, price };
    inventory.push(newItem);
    res.status(201).json(newItem);
});

// 3. Track repair status (Customer Route)
app.get('/api/repairs/:id', (req, res) => {
    const ticket = repairs.find(r => r.ticketId === req.params.id.toUpperCase());
    if (!ticket) {
        return res.status(404).json({ error: 'Repair ID not found.' });
    }
    res.json(ticket);
});

// 4. Update repair status & trigger simulated alert (Shopkeeper Route)
app.post('/api/repairs/update', (req, res) => {
    const { ticketId, status } = req.body;
    const ticket = repairs.find(r => r.ticketId === ticketId.toUpperCase());
    
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    
    ticket.status = status;

    // Simulate sending a WhatsApp notification via an API webhook like Twilio
    if (status === 'Ready') {
        console.log(`[ALERT] WhatsApp sent to ${ticket.phone}: "Hello ${ticket.customerName}, your ${ticket.device} is ready for pickup!"`);
    }

    res.json({ success: true, message: `Status updated to ${status}. Notification triggered.` });
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});