import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TimeTickerProvider } from "./context/TimeTickerContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <TimeTickerProvider>
       <App />  
     </TimeTickerProvider>    
  </StrictMode>
);
