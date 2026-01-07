import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import { Routes,Route } from "react-router-dom"

export default function HomePage(){
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Routes path="/">
                    <Route path="/" element={<Hero />} />
                    <Route path="/events" element={<></>} />
                    <Route path="/about" element={<></>} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}


