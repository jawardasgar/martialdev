"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware setup
app.use(express_1.default.json());
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Sample route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
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
