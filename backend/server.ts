import express from 'express';
import cors from 'cors';

import { accordions } from './data/about-us/accordion.js';
import { reviews } from './data/about-us/reviews.js';

import { accountPayments } from './data/faqs/account-payments.js';
import { appointmentsBooking } from './data/faqs/appointments-booking.js';
import { ordersDelivery } from './data/faqs/orders-delivery.js';
import { productsAftercare } from './data/faqs/products-aftercare.js';
import { servicesPricing } from './data/faqs/services-pricing.js';
import { shippingReturns } from './data/faqs/shipping-returns.js';

import { services } from './data/services.js';
import { products } from './data/products.js';
import { deliveryOpts } from './data/deliveryOption.js';


import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://Monty:Dbnip777@cluster0.wcj1q1o.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to Gilded Vault (MongoDB)'))
    .catch((err) => console.error('❌ Connection error:', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// A basic route so we can see it working
app.get('/', (req, res) => {
    res.send('GILDED Backend is officially running! ✨');
});

// About Us Page
app.get('/api/about/accordion', (req, res) => {
    res.json(accordions);
});

// Faqs Page
app.get('/api/faqs', (req, res) => {
    res.json({
        accountPayments,
        appointmentsBooking,
        ordersDelivery,
        productsAftercare,
        servicesPricing,
        shippingReturns,
    })
})

// Services
app.get('/api/services', (req, res) => {
    res.json(services);
})


// Products
app.get('/api/products', (req, res) => {
    res.json(products);
})

// Delviery Options
app.get('/api/services', (req, res) => {
    res.json(deliveryOpts);
})

app.get('/api/about/reviews', (req, res) => {
    res.json(reviews);
});

app.listen(PORT, () => {
    console.log(`🚀 Server is flying at http://localhost:${PORT}`);
});

