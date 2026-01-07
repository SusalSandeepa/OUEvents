import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventCard from './components/EventCard/EventCard';
import CountdownBadge2 from "./pages/EventDetail/CountdownBadge2";
import { TimeTickerProvider } from "./context/TimeTickerContext"; 

function App() {
  // Mock event data for testing EventCard
  const mockEvent = {
    _id: "12345",
    title: "Summer Music Festival 2025",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
    startDateTime: "2026-03-15T18:00:00Z",
    endDateTime: "2026-03-15T23:00:00Z",
    venue: "Central Park, New York"
  };
  return (
    
    <TimeTickerProvider>
      <Navbar />
      <Footer />
      <Hero/>
      <div className="max-w-sm mx-auto">
        <EventCard event={mockEvent} />
      </div>         
      <CountdownBadge2 targetDateTime="2027-01-07T00:17:15Z" />    
    </TimeTickerProvider>

  );
}

export default App;
