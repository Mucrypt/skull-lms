const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    instructorId: String,
    instructorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePricing: String,
    stripeSessionId: String, // Add this field to store the Stripe session ID
});

module.exports = mongoose.model("Order", OrderSchema);
