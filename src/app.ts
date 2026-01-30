import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Sample route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'MartialDev' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🥋 MartialDev server is running on http://localhost:${PORT}`);
    console.log(`🚀 Futuristic development platform initialized`);
});