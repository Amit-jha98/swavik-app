import { CraftScrollStory } from '@/components/luxury/CraftScrollStory';
import { Hero } from '@/components/luxury/Hero';
import { ExperienceFlow } from '@/components/luxury/ExperienceFlow';

export function Home() {
  return (
    <main className="bg-ink-950 text-cream-50">
      <Hero />
      <CraftScrollStory />
      <ExperienceFlow />
    </main>
  );
}
