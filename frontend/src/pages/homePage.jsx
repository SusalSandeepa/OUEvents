import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Hero from "../components/Hero"

export default function HomePage(){
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Hero />
            </main>
            <Footer />
        </div>
    )
}


