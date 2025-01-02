const { updateStudentCourses, updateCourseStudents } = require('../../utiles/paymentUtils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import Stripe with the secret key
const Order = require('../../models/Order');

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    // Validate the event's authenticity using Stripe's signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Retrieve the orderId from the metadata field
      const orderId = session.metadata.orderId;

      // Find the corresponding order in the database
      const order = await Order.findById(orderId);

      if (order) {
        // Update order status to paid and confirmed
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        await order.save();

        // Update student courses and course schema using utility functions
        await updateStudentCourses(order);
        await updateCourseStudents(order);

        console.log(`Order ${order._id} finalized successfully.`);
      } else {
        console.error(`Order with ID ${orderId} not found.`);
      }
    }

    // Send a 200 response to Stripe to acknowledge the event
    res.status(200).send();
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

module.exports = { stripeWebhook };
