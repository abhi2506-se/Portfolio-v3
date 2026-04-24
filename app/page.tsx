import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Skills } from '@/components/skills'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <Hero />
      
      <section className="border-t border-border">
        <About />
      </section>
      
      <section className="border-t border-border">
        <Skills />
      </section>
      
      <section className="border-t border-border">
        <Experience />
      </section>
      
      <section className="border-t border-border">
        <Projects />
      </section>
      
      <section className="border-t border-border">
        <Contact />
      </section>
      
      <Footer />
    </main>
  )
}
