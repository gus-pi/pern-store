import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); //helmet is a security middleware that protects the app by setting various HTTP headers

app.use(morgan('dev')); //morgan logs requests

app.get('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
