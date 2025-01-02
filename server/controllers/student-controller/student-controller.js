const Course = require("../../models/Course-Model");
const StudentCourses = require("../../models/StudentCourses");

// Get a list of all student-viewable courses
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    const filters = {};

    // Add filters based on query parameters
    if (category.trim()) {
      filters.category = { $in: category.split(",") };
    }
    if (level.trim()) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.trim()) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    // Define sorting parameters
    const sortParam = {
      "price-lowtohigh": { pricing: 1 },
      "price-hightolow": { pricing: -1 },
      "title-atoz": { title: 1 },
      "title-ztoa": { title: -1 },
    }[sortBy] || { pricing: 1 };

    const coursesList = await Course.find(filters).sort(sortParam).lean();

    if (coursesList.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No courses found matching the filters.",
      });
    }

    const coursesWithTotalDuration = coursesList.map((course) => {
      const totalMinutes = course.curriculum?.reduce(
        (acc, lecture) => acc + (lecture.duration || 0),
        0
      ) || 0;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        ...course,
        totalDuration: `${hours}h ${minutes}m`,
        totalMinutes,
      };
    });

    res.status(200).json({
      success: true,
      data: coursesWithTotalDuration,
    });
  } catch (error) {
    console.error("Error fetching courses:", error.message || error);
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

    const courseDetails = await Course.findById(id).lean();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or is not available for viewing.",
        data: null,
      });
    }

    const totalMinutes = courseDetails.curriculum?.reduce(
      (acc, lecture) => acc + (lecture.duration || 0),
      0
    ) || 0;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    res.status(200).json({
      success: true,
      data: {
        ...courseDetails,
        totalDuration: `${hours}h ${minutes}m`,
      },
    });
  } catch (error) {
    console.error("Error fetching course details:", error.message || error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching course details.",
    });
  }
};




// Fetch courses purchased by a student
const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
    console.log("ifStudentAlreadyBoughtCurrentCourse", ifStudentAlreadyBoughtCurrentCourse);

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if `studentId` is provided
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    // Fetch the student's courses
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    console.log("studentBoughtCourses", studentBoughtCourses);

    // Handle the case where no courses are found for the student
    if (!studentBoughtCourses) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the specified student.",
      });
    }

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });


  } catch (error) {
    console.error("Error fetching courses by student ID:", error.message || error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};





module.exports = {
  checkCoursePurchaseInfo,
  getAllStudentViewCourses,
  getAllStudentViewCourseDetails,
  getCoursesByStudentId,
};
