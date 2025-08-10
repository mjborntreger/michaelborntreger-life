// app/projects/page.tsx
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { listRecentProjects } from '@/lib/wp';

export const revalidate = 600;

export const metadata = {
  title: 'Projects',
  description: 'Recent work and experiments.',
};

export default async function ProjectsIndex() {
  // bump this if you want more; can add pagination later
  const projects = await listRecentProjects(24);

  if (!projects.length) {
    return (
      <div className="space-y-6">
        <div className="pt-6">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Projects</h1>
        <p className="muted">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Projects</h1>
        <p className="muted">Explore my career, side projects, and whatever else I've been working on.</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
