import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
import RouteGuard from './components/route-guard'
import { useContext } from 'react'
import { AuthContext } from './context/auth-context'
import InstructorDashboard from './pages/instructor'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentHomePage from './pages/student/home'





function App() {

  const {auth} = useContext(AuthContext)


  return (
   <Routes>
     <Route path='/auth' 
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

     <Route path='/' 
      element={
        <RouteGuard 
        element={
          <StudentViewCommonLayout />
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }      
     >
       
       <Route path='home' element={<StudentHomePage/>} />
       <Route path='' element={<StudentHomePage/>} />

     </Route>
   </Routes>
  )
}

export default App