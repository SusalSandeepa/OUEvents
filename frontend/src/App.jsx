import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import { Toaster } from "react-hot-toast";
import Test from "./pages/Test";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="w-full h-[100vh]">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
