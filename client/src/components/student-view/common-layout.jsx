import { Outlet } from "react-router-dom";

function StudentViewCommonLayout() {
    return (
        <div>
            Student Common Layout
            <Outlet />
        </div>
    )
}

export default StudentViewCommonLayout;