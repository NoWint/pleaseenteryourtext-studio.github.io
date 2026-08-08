import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Nav } from './components/Nav';
import { Footer } from './sections/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDots } from './components/SectionDots';
import { SceneBackground } from './components/SceneBackground';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Team } from './sections/Team';
import { Join } from './sections/Join';
import { SECTIONS } from './data/site';

export function App() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.9, 1],
    [0, 0.82, 0.82, 0.82],
  );

  return (
    <>
      <SceneBackground plyPath="gaussians/jd.ply" />
      <motion.div
        className="bg-veil"
        style={prefersReducedMotion ? undefined : { opacity: veilOpacity }}
        aria-hidden="true"
      />
      <a href="#hero" className="skip-link">跳到内容</a>
      <ScrollProgress />
      <Nav />
      <SectionDots sections={SECTIONS} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Team />
        <Join />
      </main>
      <Footer />
    </>
  );
}
