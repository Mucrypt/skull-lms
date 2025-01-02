import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
import RouteGuard from './components/route-guard'
import { useContext } from 'react'
import { AuthContext } from './context/auth-context'
import InstructorDashboard from './pages/instructor'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentHomePage from './pages/student/home'
import NotFoundPage from './pages/not-found'
import AddNewCoursePage from './pages/instructor/add-new-course'
import StudentViewCoursesPage from './pages/student/courses'
import StudentViewCourseDetailsPage from './pages/student/course-details'
import StripePaymentReturnPage from './pages/student/payment-return'
import StudentCoursesPage from './pages/student/student-courses'
import StudentViewCourseProgressPage from './pages/student/course-progress'

function App() {
  const { auth } = useContext(AuthContext);

  // Ensure the authentication state is preserved
  // You can add additional logging or checks here if needed

  return (
    <Routes>
      <Route
        path='/auth'
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path='/instructor'
        element={
          <RouteGuard
            element={<InstructorDashboard />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path='/instructor/create-new-course'
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path='/instructor/edit-course/:courseId'
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path='/'
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path='' element={<StudentHomePage />} />
        <Route path='home' element={<StudentHomePage />} />
        <Route path='courses' element={<StudentViewCoursesPage />} />
        <Route path='course/details/:id' element={<StudentViewCourseDetailsPage />} />
        <Route path="payment-return/:sessionId" element={<StripePaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="payment-return" element={<StripePaymentReturnPage />} />
        <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;