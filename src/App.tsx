import { ScrollProgress } from './components/ScrollProgress';
import { SideRail } from './components/SideRail';
import { useActiveSection } from './hooks/useActiveSection';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Team } from './sections/Team';
import { Join } from './sections/Join';
import { SECTIONS } from './data/site';
import { useMemo } from 'react';

export function App() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useActiveSection(ids);
  const sections = SECTIONS.map((s) => ({ id: s.id, label: s.label, num: s.num }));

  return (
    <>
      <ScrollProgress />
      <SideRail
        sections={sections}
        activeId={activeId}
        onNavigate={(id) =>
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      <a href="#hero" className="skip-link">跳到内容</a>
      <main>
        <Hero />
        <About />
        <Projects />
        <Team />
        <Join />
      </main>
    </>
  );
}
