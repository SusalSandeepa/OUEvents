import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Events from "./Events/Events";
import About from "./About/About";
import EventDetail from "./EventDetail/EventDetail.jsx";
import EventRegistration from "./EventDetail/EventRegistration.jsx";
import MyEvents from "./MyEvents.jsx";
import { Routes, Route } from "react-router-dom";
import Settings from "../components/settings";
import MyProfile from "../components/myProfile";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />{" "}
      <div className="min-h-screen bg-[#FAF7F2]">
        <main className="flex-1">
          <Routes>
            <Route index element={<Hero />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="events/:id/register" element={<EventRegistration />} />
            <Route path="about" element={<About />} />
            <Route path="settings" element={<Settings />} />
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="my-events" element={<MyEvents />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
