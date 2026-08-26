import Console from './components/Console';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.layout}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Console />

      <main id="main" className={styles.content}>
        <div className={styles.inner}>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
