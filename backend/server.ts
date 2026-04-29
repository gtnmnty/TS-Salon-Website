import express from 'express';
import cors from 'cors';

import { accordions } from './data/about-us/accordion.js';
import { reviews } from './data/about-us/reviews.js';

import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://Monty:Dbnip777@cluster0.wcj1q1o.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to Gilded Vault (MongoDB)'))
  .catch((err) => console.error('❌ Connection error:', err));

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// A basic route so we can see it working
app.get('/', (req, res) => {
    res.send('GILDED Backend is officially running! ✨');
});

app.get('api/about/accordion', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`🚀 Server is flying at http://localhost:${PORT}`);
});

