const Course = require("../../models/Course-Model");

// Get a list of all student-viewable courses
/**
 * Fetches and returns a list of courses based on the provided filters and sorting options.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.category] - Comma-separated list of categories to filter by.
 * @param {string} [req.query.level] - Comma-separated list of levels to filter by.
 * @param {string} [req.query.primaryLanguage] - Comma-separated list of primary languages to filter by.
 * @param {string} [req.query.sortBy='price-lowtohigh'] - Sorting option for the courses. 
 *        Possible values: 'price-lowtohigh', 'price-hightolow', 'title-atoz', 'title-ztoa'.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * 
 * @throws {Error} - Throws an error if there is an issue fetching the courses.
 */
/**
 * Retrieves all student view courses based on provided filters and sorting options.
 * 
 * @async
 * @function getAllStudentViewCourses
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters for filtering and sorting.
 * @param {string} [req.query.category] - Comma-separated list of categories to filter by.
 * @param {string} [req.query.level] - Comma-separated list of levels to filter by.
 * @param {string} [req.query.primaryLanguage] - Comma-separated list of primary languages to filter by.
 * @param {string} [req.query.sortBy='price-lowtohigh'] - Sorting option (price-lowtohigh, price-hightolow, title-atoz, title-ztoa).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * @throws {Error} - Throws an error if there is an issue fetching courses.
 */
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};

    // Add filters only if the query parameters are not empty
    if (category.trim()) {
      filters.category = { $in: category.split(",") };
    }
    if (level.trim()) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.trim()) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
       break;
    }

    const coursesList = await Course.find(filters)
      .sort(sortParam)
      .lean();

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
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};




// Get details of a single student-viewable course
/**
 * Retrieves detailed view of a course for a student, including total duration.
 *
 * @async
 * @function getAllStudentViewCourseDetails
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - Course ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with course details or an error message.
 */
const getAllStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findOne({ _id: id, });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or is not available for viewing.",
        data: null,
      });
    }

    // Calculate totalDuration dynamically for the detailed view
    const totalDuration = courseDetails.curriculum.reduce((acc, lecture) => acc + (lecture.duration || 0), 0);

    res.status(200).json({
      success: true,
      data: { ...courseDetails._doc, totalDuration },
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
