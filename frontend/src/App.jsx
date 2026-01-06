import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventCard from './components/EventCard/EventCard';

function App() {
  // Mock event data for testing EventCard
  const mockEvent = {
    _id: "12345",
    title: "Summer Music Festival 2025",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
    startDateTime: "2025-07-15T18:00:00Z",
    endDateTime: "2025-07-15T23:00:00Z",
    venue: "Central Park, New York"
  };
  return (
    <>
      <Navbar />
      <Footer />
      <Hero/>
      <div className="max-w-sm mx-auto">
        <EventCard event={mockEvent} />
      </div>
    </>
  );
}

export default App;
