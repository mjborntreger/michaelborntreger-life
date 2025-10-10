// app/projects/page.tsx
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { listRecentProjects } from '@/lib/wp';
import { TypographyH1, TypographyLead } from '@/components/components/ui/typography';

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
        <TypographyH1 className="text-4xl">Projects</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">No projects yet.</TypographyLead>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Projects</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">
          Explore my career, side projects, and whatever else I've been working on.
        </TypographyLead>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
