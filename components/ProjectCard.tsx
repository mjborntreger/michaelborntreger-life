import Link from 'next/link';
import { Card } from '@/components/components/ui/card';
import { Badge } from '@/components/components/ui/badge';

export default function ProjectCard({ p }: { p: any }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/projects/${p.slug}`} className="block">
        {p.heroImage?.url && (
          <img className="h-48 w-full bg-muted object-contain" src={p.heroImage.url} alt={p.title} />
        )}
        <div className="p-4">
          <h3 className="font-medium">{p.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.year} · {p.role}
          </p>
          {p.techStack?.length ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {p.techStack.slice(0,4).map((t: string) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}
