import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function StudentHomePage() {
  const {resetCredentials} = useContext(AuthContext)


  function handleLogout() {
    // Implement logout logic
    resetCredentials()
    sessionStorage.clear()
  }



  return (
    <div>
      Student Home Page

      <Button  onClick={handleLogout} >
        Logout
      </Button>
    </div>
  );
}


export default StudentHomePage;