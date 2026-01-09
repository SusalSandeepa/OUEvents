import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-[100vh]">
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
