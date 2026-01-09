import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Events from "./Events/Events"
import { Routes, Route } from "react-router-dom"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route index element={<Hero />} />
                    <Route path="events" element={<Events />} />
                    <Route path="about" element={<div>About page</div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}


