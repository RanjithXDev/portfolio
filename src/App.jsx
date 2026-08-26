import { lazy, Suspense } from 'react';
import Console from './components/Console';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Credentials from './components/Credentials';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useScrollCamera } from './hooks/useScrollCamera';
import styles from './App.module.css';

// The 3D stack is ~900 kB; lazy-loading keeps it out of the initial bundle.
const Scene = lazy(() => import('./three/Scene'));

export default function App() {
  useScrollCamera();

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

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
            <Credentials />
            <Projects />
            <Contact />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
