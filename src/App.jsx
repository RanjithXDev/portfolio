import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Credentials from './components/Credentials';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ContentProvider } from './content/ContentContext';
import styles from './App.module.css';

export default function App() {
  return (
    <ContentProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <div className={styles.inner}>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Credentials />
          <Projects />
        </div>

        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  );
}
