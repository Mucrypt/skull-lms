import { GraduationCap, TvMinimalPlay } from 'lucide-react';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { AuthContext } from '@/context/auth-context';

function StudentViewCommonHeader() {
  const navigate = useNavigate()
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 shadow-md bg-white border-b border-gray-200">
      {/* Left Section: Logo and Navigation */}
      <div className="flex items-center space-x-6">
        <Link to="/home" className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          <span className="font-bold text-lg md:text-xl text-gray-800">Skull Mukulah</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">

          <Button
            variant="outline"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className=" text-sm md:text-base font-medium"
          >
            Explore Courses
          </Button>
          <Link
            to="/student-courses"
            className="text-gray-700 text-sm md:text-base font-medium hover:text-indigo-600 flex items-center space-x-1"
          >
            <TvMinimalPlay className="w-6 h-6 text-gray-500" />
            <span>My Courses</span>
          </Link>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={handleLogout}
          className=" text-white text-sm md:text-base font-medium px-4 py-2 rounded-md"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;

