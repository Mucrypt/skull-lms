import { Skeleton } from "@/components/ui/skeleton";
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
  const [loading, setLoading] = useState(true);

  // Helper function to set authentication state
  const setAuthState = (authenticate, user) => {
    setAuth({ authenticate, user });
    localStorage.setItem("authState", JSON.stringify({ authenticate, user }));
  };

  // Helper function for error feedback
  const showError = (message) => {
    console.error(message);
    // Optional: Trigger a toast or alert for the user
  };

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        setAuthState(true, data.data.user);
      } else {
        showError(data.message || "Registration failed.");
        setAuthState(false, null);
      }
    } catch (error) {
      showError(error.message || "An unexpected error occurred during registration.");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        localStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
        setAuthState(true, data.data.user);
      } else {
        showError(data.message || "Login failed.");
        setAuthState(false, null);
      }
    } catch (error) {
      showError(error.message || "An unexpected error occurred during login.");
    }
  }

  async function checkAuthUser() {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      if (!token) {
        console.warn("No token found in localStorage.");
        setAuthState(false, null);
        return;
      }
      const data = await checkAuthService();
      if (data.success) {
        setAuthState(true, data.data.user);
      } else {
        console.warn("Invalid or expired token.");
        resetCredentials(); // Clear credentials if token is invalid
      }
    } catch (error) {
      showError(error.message || "Error verifying authentication.");
      resetCredentials();
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authState");
    setAuthState(false, null);
  }

  useEffect(() => {
    const storedAuthState = JSON.parse(localStorage.getItem("authState"));
    if (storedAuthState) {
      setAuth(storedAuthState);
    }
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
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
