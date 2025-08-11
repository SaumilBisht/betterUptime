import {Header} from "../components/Header"
import {Footer} from "../components/Footer"
import {Features} from "../components/Features"
import {Pricing} from "../components/Pricing"
import {Hero} from "../components/Hero"
import {Testimonials} from "../components/Testimonials"

export default function Home() {
  return (
    <div >

      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
      
    </div>
  );
}
