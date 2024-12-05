import { BarChart, Book, LogOut } from "lucide-react";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorCourses from "@/components/instructor-view/courses";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { AuthContext } from "@/context/auth-context";
import { fetchInstructorCourseListService } from "@/services";
import { InstructorContext } from "@/context/instructor-context";

function InstructorDashboardPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const {resetCredentials} = useContext(AuthContext)

    const {instructorCoursesList, 
          setInstructorCoursesList
        } = useContext(InstructorContext)

   async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService()

    console.log(response, "response")
    
    if(response?.success) {
        setInstructorCoursesList(response.data)
    }

   }

    useEffect(() => {
      fetchAllCourses()

    },[])



  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses ListOfCourses={instructorCoursesList} />
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null, // Ensure this is handled properly
    },
  ];

  function handleLogout() {
    // Implement logout logic
    resetCredentials()
    sessionStorage.clear()
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-extrabold mb-4">Instructor View</h2>
        </div>
        <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={menuItem.value === activeTab ? "secondary" : "ghost"}
                onClick={menuItem.value === "logout" ? 
                    handleLogout : () => setActiveTab(menuItem.value)
                 }
               
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7x1 mx-auto" >
            <h1 className="text-3xl font-extrabold md-8" >
                Instructor Dashboard
            </h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
  {menuItems.map((menuItem) => (
    <TabsContent key={menuItem.value} value={menuItem.value}>
      {menuItem.component !== null ? menuItem.component : null}
    </TabsContent>
  ))}
</Tabs>


        </div>

      </main>

     
    </div>
  );
}

export default InstructorDashboardPage;
