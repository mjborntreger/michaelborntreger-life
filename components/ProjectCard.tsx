import Link from 'next/link';

export default function ProjectCard({ p }: { p: any }) {
  return (
    <article className="card overflow-hidden">
      <Link href={`/projects/${p.slug}`} className="block">
        {p.heroImage?.url && (
          <img className="w-full h-48 object-contain bg-neutral-50" src={p.heroImage.url} alt={p.title} />
        )}
        <div className="p-4">
          <h3 className="font-medium">{p.title}</h3>
          <p className="muted text-sm mt-1">{p.year} · {p.role}</p>
          {p.techStack?.length ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {p.techStack.slice(0,4).map((t: string) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
