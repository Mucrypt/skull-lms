const stripe = require('../../helpers/stripe');
const Order = require('../../models/Order');
const Course = require('../../models/Course-Model');
const StudentCourses = require('../../models/StudentCourses');

// Create a Stripe order and session
const createStripeOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
      instructorId,
      instructorName,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !userName ||
      !userEmail ||
      !courseImage ||
      !courseTitle ||
      !courseId ||
      !coursePricing
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Stripe Checkout Session parameters
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: courseTitle,
              images: [courseImage],
            },
            unit_amount: Math.round(coursePricing * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Save the order in the database
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: 'pending',
      paymentMethod: 'stripe',
      paymentStatus: 'initiated',
      orderDate: new Date(),
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
      stripeSessionId: session.id, // Save the session ID
    });

    await newOrder.save();

    // Return session info to the client
    res.status(201).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err) {
    console.error('Stripe Error:', err.message || err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the Stripe order',
    });
  }
};

// Finalize Stripe payment
const finalizeStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Received sessionId:", sessionId);


    if (session.payment_status === 'paid') {
      // Find the order in the database
      const order = await Order.findOne({ stripeSessionId: sessionId });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Update order details
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      await order.save();

      // Update or create StudentCourses schema
      const courseDetails = {
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      };

      const studentCourses = await StudentCourses.findOneAndUpdate(
        { userId: order.userId },
        { $push: { courses: courseDetails } },
        { new: true, upsert: true }
      );

      // Update the Course schema
      await Course.findByIdAndUpdate(order.courseId, {
        $addToSet: {
          students: {
            studentId: order.userId,
            studentName: order.userName,
            studentEmail: order.userEmail,
            paidAmount: order.coursePricing,
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Payment successful and student records updated',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Payment not completed',
    });
  } catch (err) {
    console.error('Stripe Finalization Error:', err.message || err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during payment finalization',
    });
  }
};

module.exports = { createStripeOrder, finalizeStripePayment };