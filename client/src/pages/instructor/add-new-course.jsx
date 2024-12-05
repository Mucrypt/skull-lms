import React, { useContext, useEffect } from "react";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLandingPage from "@/components/instructor-view/courses/add-new-course/course-landing-page";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import { addNewCourseService, fetchInstructorCourseDetailsService,updateCourseByIdService } from "@/services";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  // Helper function to check if a value is empty
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  // Validate form data before submission
  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const section of courseCurriculumFormData) {
      if (isEmpty(section.sectionTitle)) {
        return false;
      }

      for (const lecture of section.lectures) {
        if (
          isEmpty(lecture.title) ||
          isEmpty(lecture.videoUrl) ||
          isEmpty(lecture.public_id)
        ) {
          return false;
        }
        if (lecture.freePreview) {
          hasFreePreview = true;
        }
      }
    }

    return hasFreePreview;
  }

  // Handle course creation
  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response =
    currentEditedCourseId !== null
      ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
      : await addNewCourseService(courseFinalFormData);

  if (response?.success) {
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    navigate(-1);
    setCurrentEditedCourseId(null);
  }

  console.log(courseFinalFormData, "courseFinalFormData");
}

  

  // Fetch course details if editing an existing course
  const fetchCurrentCourseDetails = async () => {
    try {
      const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
      if (response?.success) {
        console.log("Course details fetched:", response.data);

        // Populate course landing and curriculum data
        const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
          acc[key] = response.data[key] || courseLandingInitialFormData[key];
          return acc;
        }, {});

        console.log("Set form data:", setCourseFormData, response.data);

        setCourseLandingFormData(setCourseFormData);
        setCourseCurriculumFormData(response?.data?.curriculum);
        
      } else {
        alert("Failed to fetch course details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("An error occurred while fetching course details.");
    }
  };

  // Set the current course ID from params if available
  useEffect(() => {
    if (params.courseId) {
      setCurrentEditedCourseId(params?.courseId);
    }
  }, [params?.courseId]);

  // Fetch course details when currentEditedCourseId changes
  useEffect(() => {
    if (currentEditedCourseId) {
      fetchCurrentCourseDetails();
    }
  }, [currentEditedCourseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          {currentEditedCourseId ? "Edit Course" : "Create New Course"}
        </h1>
        <Button
          className="text-sm tracking-wider font-bold px-8"
          disabled={validateFormData()}
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="course-curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="course-curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="course-settings">Course Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="course-curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLandingPage />
              </TabsContent>
              <TabsContent value="course-settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
