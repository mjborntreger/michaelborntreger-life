// wp.ts
const endpoint = process.env.WPGRAPHQL_URL!;
if (!endpoint) throw new Error('Missing WPGRAPHQL_URL env var');

type Vars = Record<string, unknown>;

async function request<T>(query: string, variables?: Vars, init?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    next: { tags: ['wp'] },
    body: JSON.stringify({ query, variables }),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`GraphQL: ${json.errors.map((e: { message: string }) => e.message).join(' | ')}`);
  }
  return json.data as T;
}

export type WPImage = { url: string; altText?: string | null };

/* ===================== Tech Stack Types ===================== */

export type TechTerm = {
  id: string;
  dbId: number;
  name: string;
  slug: string;
  parentDbId: number | null;
};

export type SelectedTech = {
  id: string;
  dbId: number;
  name: string;
  parentDbId: number | null;
};

/* ===================== Internal GraphQL Shapes ===================== */

type ProjectNode = {
  slug: string;
  title: string;
  content?: string | null;
  date?: string | null;
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    focusKeywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      type?: string;
      siteName?: string;
      locale?: string;
      image?: { url?: string; secureUrl?: string; width?: number; height?: number; type?: string };
      articleMeta?: { publishedTime?: string; modifiedTime?: string; section?: string };
    }
  }
  projectFields?: {
    role?: string | null;
    startDate?: string | null;
    endDate?: string | null;

    techStack?: {
      edges?: Array<{
        node?: {
          id: string;
          databaseId: number;
          name: string;
          parentDatabaseId?: number | null;
        } | null;
      } | null> | null;
      nodes?: Array<{
        id: string;
        databaseId: number;
        name: string;
        parentDatabaseId?: number | null;
      }> | null;
    } | null;
    heroImage?: { node?: { id?: string | null; sourceUrl: string; altText?: string | null } | null } | null;
    links?: Array<{ label: string | null; url: string | null } | null> | null;
  } | null;
};


type PostNode = {
  slug: string;
  title: string;
  date: string;
  content?: string | null;
};

/* ===================== Public Return Types (definite) ===================== */

export type ProjectCard = {
  slug: string;
  title: string;
  role: string;
  heroImage: WPImage | null;
  techStack: string[]; // flat names for chips
  startDate?: string | null;
  endDate?: string | null;
};

type Project = {
  slug: string;
  title: string;
  contentHtml: string;
  date?: string | null;
  role?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  heroImage?: { url: string; altText?: string | null } | null;
  techStack: { dbId: number; name: string }[];
  links: { label: string; url: string }[];
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    focusKeywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      type?: string;
      siteName?: string;
      locale?: string;
      image?: { url?: string; secureUrl?: string; width?: number; height?: number; type?: string };
      articleMeta?: { publishedTime?: string; modifiedTime?: string; section?: string };
    };
  } | null;
};


export type Post = {
  slug: string;
  title: string;
  date: string;
  contentHtml: string; // definite
};

/* ===================== Projects ===================== */

export async function listRecentProjects(limit = 6): Promise<ProjectCard[]> {
  const query = /* GraphQL */ `
    query RecentProjects($limit: Int!) {
      projects(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          slug
          title
          projectFields {
            role
            startDate
            endDate
            techStack {
              edges {
                node {
                  id
                  name
                  # parentDatabaseId is only on hierarchical terms, so use an inline fragment
                  ... on HierarchicalTermNode {
                    parentDatabaseId
                  }
                }
              }
            }
            heroImage { node { id sourceUrl altText } }
          }
        }
      }
    }
  `;

  const data = await request<{ projects: { nodes: ProjectNode[] } }>(query, { limit });
  const nodes = data.projects?.nodes ?? [];

  return nodes.map((n): ProjectCard => {
    // Keep only *top-level* categories (no parent)
    const topLevelTech =
      n.projectFields?.techStack?.edges
        ?.map(e =>
          e?.node
            ? {
                name: e.node.name,
                parentDbId:
                  (e.node.parentDatabaseId ?? null),
              }
            : null
        )
        .filter(
          (x): x is { name: string; parentDbId: number | null } => Boolean(x)
        )
        .filter(x => x.parentDbId == null) // null or undefined → treat as top-level
        .map(x => x.name) ?? [];

    const heroImage = n.projectFields?.heroImage?.node
      ? {
          url: n.projectFields.heroImage.node.sourceUrl,
          altText: n.projectFields.heroImage.node.altText ?? null,
        }
      : null;

    return {
      slug: n.slug,
      title: n.title,
      role: n.projectFields?.role ?? "",
      heroImage,
      techStack: topLevelTech,
      startDate: n.projectFields?.startDate ?? null,
      endDate: n.projectFields?.endDate ?? null,
    };
  });
}




export async function listProjectSlugs(limit = 200): Promise<string[]> {
  const query = /* GraphQL */ `
    query ListProjectSlugs($limit: Int!) {
      projects(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes { slug }
      }
    }
  `;
  const data = await request<{ projects: { nodes: { slug: string | null }[] } }>(query, { limit });
  return (data.projects?.nodes ?? [])
    .map(n => n?.slug ?? null)
    .filter((s): s is string => Boolean(s));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const query = /* GraphQL */ `
    query ProjectBySlug($slug: ID!) {
      project(id: $slug, idType: SLUG) {
        slug
        title
        content
        date
        seo {
          title
          description
          canonicalUrl
          focusKeywords
          openGraph {
            title
            description
            url
            type
            siteName
            locale
            updatedTime
            image {
              url
              secureUrl
              width
              height
              type
            }
            articleMeta {
              author
              publisher
              section
              publishedTime
              modifiedTime
            }
          }
        }
        projectFields {
          role
          startDate
          endDate
          techStack {
            edges {
              node {
                id
                databaseId
                name
                ... on HierarchicalTermNode {
                  parentDatabaseId
                }
              }
            }
          }
          heroImage {
            node {
              id
              sourceUrl
              altText
            }
          }
          links {
            label
            url
          }
        }
      }
    }
  `;

  const data = await request<{ project: ProjectNode | null }>(query, { slug });
  const p = data.project;
  if (!p) return null;

  const techStack: SelectedTech[] =
    p.projectFields?.techStack?.edges
      ?.map(e =>
        e?.node
          ? {
              id: e.node.id,
              dbId: e.node.databaseId,
              name: e.node.name,
              parentDbId: e.node.parentDatabaseId ?? null,
            }
          : null
      )
      .filter((x): x is SelectedTech => Boolean(x)) ?? [];

  const heroImage = p.projectFields?.heroImage?.node
    ? {
        url: p.projectFields.heroImage.node.sourceUrl,
        altText: p.projectFields.heroImage.node.altText ?? null,
      }
    : null;

  const links =
    p.projectFields?.links
      ?.map(l =>
        l?.label && l?.url ? { label: l.label, url: l.url } : null
      )
      .filter(
        (x): x is { label: string; url: string } => Boolean(x)
      ) ?? [];

  return {
    slug: p.slug,
    title: p.title,
    contentHtml: p.content ?? '',
    date: p.date ?? null,
    role: p.projectFields?.role ?? '',
    techStack,
    heroImage,
    links,
    startDate: p.projectFields?.startDate ?? null,
    endDate: p.projectFields?.endDate ?? null,
    seo: p.seo ?? null,
  };
}


/* ===================== All Tech Stack Terms (for tree building) ===================== */

export async function listAllTechStackTerms(): Promise<TechTerm[]> {
  // Using default WP "category" taxonomy as the Tech Stack source.
  const query = /* GraphQL */ `
    query AllTechStackTerms($tax: [TaxonomyEnum!]) {
      terms(first: 1000, where: { taxonomies: $tax, hideEmpty: false }) {
        nodes {
          id
          databaseId
          name
          slug
          ... on HierarchicalTermNode { parentDatabaseId }
        }
      }
    }
  `;

  const data = await request<{ terms: { nodes: any[] } }>(query, { tax: ['CATEGORY'] });
  const nodes = data.terms?.nodes ?? [];

  return nodes.map((t) => ({
    id: t.id as string,
    dbId: t.databaseId as number,
    name: t.name as string,
    slug: t.slug as string,
    parentDbId: (t.parentDatabaseId ?? null) as number | null,
  }));
}


/* ===================== Posts ===================== */

export async function listRecentPosts(limit = 3): Promise<Array<Omit<Post, 'contentHtml'>>> {
  const query = /* GraphQL */ `
    query RecentPosts($limit: Int!) {
      posts(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes { slug title date }
      }
    }
  `;
  const data = await request<{ posts: { nodes: PostNode[] } }>(query, { limit });
  const nodes = data.posts?.nodes ?? [];
  return nodes.map(n => ({ slug: n.slug, title: n.title, date: n.date }));
}

export async function listPostSlugs(limit = 200): Promise<string[]> {
  const query = /* GraphQL */ `
    query ListPostSlugs($limit: Int!) {
      posts(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes { slug }
      }
    }
  `;
  const data = await request<{ posts: { nodes: { slug: string | null }[] } }>(query, { limit });
  return (data.posts?.nodes ?? [])
    .map(n => n?.slug ?? null)
    .filter((s): s is string => Boolean(s));
}

export async function getPostBySlug(slug: string) {
  const query = /* GraphQL */ `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        content
        date
        seo {
          title
          description
          canonicalUrl
          isPillarContent
          focusKeywords
          openGraph {
            title
            description
            url
            type
            siteName
            locale
            updatedTime
            image {
              url
              secureUrl
              width
              height
              type
            }
            articleMeta {
              author
              publisher
              section
              publishedTime
              modifiedTime
            }
          }
        }
      }
    }
  `;
  const data = await request<{ post: any }>(query, { slug });
  const n = data.post;
  if (!n) return null;

  return {
    slug: n.slug,
    title: n.title,
    contentHtml: n.content ?? '',
    date: n.date ?? null,
    seo: n.seo ?? null,
  };
}

/* ===================== Links page ===================== */

type LinkItem = { label: string; url: string; description?: string };

export async function getLinks(): Promise<LinkItem[]> {
  const query = /* GraphQL */ `
    query LinksPage {
      page(id: "/links", idType: URI) {
        linksFields {
          items {
            label
            url
            description
          }
        }
      }
    }
  `;

  try {
    const data = await request<{
      page?: {
        linksFields?: {
          items?: Array<{ label: string | null; url: string | null; description?: string | null } | null> | null;
        } | null;
      } | null;
    }>(query);

    const items =
      (data.page?.linksFields?.items ?? [])
        .map((i) => {
          if (!i?.label || !i?.url) return null;
          return {
            label: i.label,
            url: i.url,
            description: i.description ?? undefined,
          } as LinkItem;
        })
        .filter((x): x is LinkItem => x !== null);

    return items;
  } catch {
    return [
      { label: 'Website', url: 'https://michaelborntreger.life' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com' },
      { label: 'GitHub', url: 'https://github.com' },
    ];
  }
}
