import dotenv from 'dotenv';
import connectDB from "./db/index.js"
import { app } from './server.js';
dotenv.config();
const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Connection failed', err);
    }
};

startServer();