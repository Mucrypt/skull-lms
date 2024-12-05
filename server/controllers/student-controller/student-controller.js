const Course = require("../../models/Course-Model");

// Get a list of all student-viewable courses
const getAllStudentViewCourses = async (req, res) => {
  try {
    // Fetch only published courses
    const coursesList = await Course.find({  });

    if (coursesList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};

// Get details of a single student-viewable course
const getAllStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findOne({ id});


    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or is not available for viewing.",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching course details.",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getAllStudentViewCourseDetails,
};
