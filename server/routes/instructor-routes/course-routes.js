//server/routes/instructor-routes/course-routes.js

const express = require('express');
const { 
    
    addNewCourse,
    getAllCourses,
    updateCourseByID,
    getCourseDetailsByID } = require('../../controllers/instructor-controller/course-controller');


const router = express.Router();

router.post('/add', addNewCourse);
router.get('/get', getAllCourses);
router.get('/get/details/:id', getCourseDetailsByID );
router.put('/update/:id', updateCourseByID);


module.exports = router;