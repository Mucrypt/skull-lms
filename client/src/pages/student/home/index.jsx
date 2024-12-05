import { Button } from "@/components/ui/button";
import banner from "@/assets/banner-img.png";
import { courseCategories } from "@/config";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";


function StudentHomePage() {
  
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);

  async function fetchAllStudentViewCourses() {
    try {
      const response = await fetchStudentViewCourseListService();
      console.log(response, "response");
      setStudentViewCoursesList(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="flex flex-col lg:flex-row items-center justify-between py-16 px-4 lg:px-16 gap-6">
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 lg:p-8 w-full lg:w-1/2 space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
            Unlock Your Potential with Expert Guidance
          </h1>
          <p className="text-lg font-medium text-gray-600">
            Explore courses that shape your skills and future. Join us and start learning today.
          </p>
          <div className="space-y-2 gap-6">
            <a href="#" className="text-indigo-600 hover:underline font-medium text-base">
              Discover Courses
            </a>
            <a href="#" className="text-indigo-600 hover:underline font-medium text-base">
              Learn More
            </a>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img src={banner} width={600} height={400} className="w-full h-auto rounded-lg shadow-lg" alt="Banner" />
        </div>
      </section>

      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.slice(0, 16).map((category) => (
            <Button className="justify-start flex items-center space-x-2" variant="outline" key={category.id}>
              <category.icon className="w-5 h-5" />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured COourses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
              key={courseItem._id}
                
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
