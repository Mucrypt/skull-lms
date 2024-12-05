import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";


function InstructorCourses({ ListOfCourses = [] }) {
  const navigate = useNavigate();

  const {
      
     setCurrentEditedCourseId,
     setCourseLandingFormData,
     setCourseCurriculumFormData  
  } = useContext(InstructorContext)
 
  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-bold">All Courses</CardTitle>
        <Button  className="px-4 py-2 rounded-md"
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
         
        >
          Create Course
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ListOfCourses.length > 0 ? (
                ListOfCourses.map((course) => (
                  <TableRow key={course.id || course._id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course?.students?.length}</TableCell>
                    <TableCell> ${course?.students?.length * course?.pricing}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log(`Deleting course: ${course.id || course._id}`)}
                      >
                        
                        <RiDeleteBin6Fill className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No courses available. Click "Create Course" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
