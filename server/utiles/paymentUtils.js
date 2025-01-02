const StudentCourses = require('../models/StudentCourses');
const Course = require('../models/Course-Model');

// Function to update the StudentCourses schema
const updateStudentCourses = async (order) => {
    const courseDetails = {
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
    };

    const studentCourses = await StudentCourses.findOne({ userId: order.userId });
    if (studentCourses) {
        studentCourses.courses.push(courseDetails);
        await studentCourses.save();
    } else {
        const newStudentCourses = new StudentCourses({
            userId: order.userId,
            courses: [courseDetails],
        });
        await newStudentCourses.save();
    }
};

// Function to update the Course schema
const updateCourseStudents = async (order) => {
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
};

module.exports = { updateStudentCourses, updateCourseStudents };
