import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";



createRoot(document.getElementById("root")).render(
  
  <BrowserRouter 
  future={{
    v7_startTransition: true, // Enable React.startTransition for state updates
    v7_relativeSplatPath: true, // Update relative path resolution for splat routes
  }}
   >
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
