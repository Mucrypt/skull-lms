const express = require("express");
const { getAllStudentViewCourses, getAllStudentViewCourseDetails } = require('../../controllers/student-controller/student-controller');
const router = express.Router();

// Routes
router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id/", getAllStudentViewCourseDetails);

module.exports = router;
