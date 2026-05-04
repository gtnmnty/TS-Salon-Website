"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const accordion_js_1 = require("./data/about-us/accordion.js");
const reviews_js_1 = require("./data/about-us/reviews.js");
const account_payments_js_1 = require("./data/faqs/account-payments.js");
const appointments_booking_js_1 = require("./data/faqs/appointments-booking.js");
const orders_delivery_js_1 = require("./data/faqs/orders-delivery.js");
const products_aftercare_js_1 = require("./data/faqs/products-aftercare.js");
const services_pricing_js_1 = require("./data/faqs/services-pricing.js");
const shipping_returns_js_1 = require("./data/faqs/shipping-returns.js");
const services_js_1 = require("./data/services.js");
const products_js_1 = require("./data/products.js");
const deliveryOption_js_1 = require("./data/deliveryOption.js");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = 'mongodb+srv://Monty:Dbnip777@cluster0.wcj1q1o.mongodb.net/?appName=Cluster0';
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('✅ Connected to Gilded Vault (MongoDB)'))
    .catch((err) => console.error('❌ Connection error:', err));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// A basic route so we can see it working
app.get('/', (req, res) => {
    res.send('GILDED Backend is officially running! ✨');
});
// About Us Page
app.get('/api/about/accordion', (req, res) => {
    res.json(accordion_js_1.accordions);
});
// Faqs Page
app.get('/api/faqs', (req, res) => {
    res.json({
        accountPayments: account_payments_js_1.accountPayments,
        appointmentsBooking: appointments_booking_js_1.appointmentsBooking,
        ordersDelivery: orders_delivery_js_1.ordersDelivery,
        productsAftercare: products_aftercare_js_1.productsAftercare,
        servicesPricing: services_pricing_js_1.servicesPricing,
        shippingReturns: shipping_returns_js_1.shippingReturns,
    });
});
// Services
app.get('/api/services', (req, res) => {
    res.json(services_js_1.services);
});
// Products
app.get('/api/products', (req, res) => {
    res.json(products_js_1.products);
});
// Delviery Options
app.get('/api/services', (req, res) => {
    res.json(deliveryOption_js_1.deliveryOpts);
});
app.get('/api/about/reviews', (req, res) => {
    res.json(reviews_js_1.reviews);
});
app.listen(PORT, () => {
    console.log(`🚀 Server is flying at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map