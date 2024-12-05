import { Outlet } from "react-router-dom";
import StudentViewCommonHeader from "./header";

function StudentViewCommonLayout() {
    return (
      <div>
        <StudentViewCommonHeader />
        <div className="pt-[80px]">
          {/* Added padding to prevent overlap */}
          <Outlet />
        </div>
      </div>
    );
  }
  
  export default StudentViewCommonLayout;
  