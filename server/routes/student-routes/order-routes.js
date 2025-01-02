const express = require('express');
const {
    createStripeOrder,
    finalizeStripePayment,
} = require('../../controllers/student-controller/payment-controller');
const {
    checkCoursePurchaseInfo,
} = require('../../controllers/student-controller/student-controller');
const { stripeWebhook } = require('../../controllers/hooks/stripeWebhook');

const router = express.Router();

// Route for creating a Stripe Checkout session
router.post('/checkout', createStripeOrder);

// Route for fetching courses bought by a student
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);


// Route for finalizing a Stripe payment
router.post('/finalize-stripe-payment', finalizeStripePayment);

// Webhook route for Stripe events
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
