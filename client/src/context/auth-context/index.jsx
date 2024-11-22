
import { Skeleton } from "@/components/ui/skeleton"

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true); // Handles loading state

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      console.log("Registering user with data:", signUpFormData); // Debug log
      const data = await registerService(signUpFormData);
      console.log("Registration successful:", data);

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      console.log("Logging in user with data:", signInFormData); // Debug log
      const data = await loginService(signInFormData);
      console.log("Login response:", data);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      console.log("Checking authenticated user...");
      const data = await checkAuthService();
      console.log("Auth check response:", data);

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    }catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);



  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials
      }}
    >
      {loading ? <Skeleton /> :  children}

      
    </AuthContext.Provider>
  );
}
