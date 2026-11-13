import { useParams } from "react-router";
import { Clock } from "lucide-react";
import { useSeo, articleLd, breadcrumbLd, crumbs, faqLd } from "../lib/seo";
import { getArticle } from "../data/insights";
import { getService } from "../data/services";
import { getProject } from "../data/projects";
import { ArrowLink, CtaBand, FaqList, PageHero } from "../components/ui";
import { ArticleCard, formatDate } from "./Insights";
import { MediaReveal, Toc, slugify } from "../components/editorial";
import NotFound from "./NotFound";

function Block({ b }) {
  switch (b.type) {
    case "h2":
      return <h2 id={slugify(b.text)}>{b.text}</h2>;
    case "h3":
      return <h3>{b.text}</h3>;
    case "ul":
      return (
        <ul>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "note":
      return <p className="prose__note">{b.text}</p>;
    case "compare":
      return (
        <div className="compare">
          {[b.a, b.b].map((col) => (
            <div key={col.h}>
              <h3>{col.h}</h3>
              <ul>
                {col.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    default:
      return <p>{b.text}</p>;
  }
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const a = getArticle(slug);
  return a ? <Detail a={a} /> : <NotFound />;
}

function Detail({ a }) {
  const path = `/insights/${a.slug}`;
  const trail = crumbs({ name: "Insights", path: "/insights" }, { name: a.title, path });
  const service = getService(a.relatedService);
  const project = a.relatedProject && getProject(a.relatedProject);
  const related = a.related.map(getArticle).filter(Boolean);
  const image = `/og/${a.slug}.png`; // drawn by scripts/og-images.py
  const toc = a.body.filter((b) => b.type === "h2").map((b) => ({ id: slugify(b.text), text: b.text }));

  useSeo({
    title: a.seoTitle,
    description: a.description,
    path,
    type: "article",
    image,
    jsonLd: [
      breadcrumbLd(trail),
      articleLd({ title: a.title, description: a.description, path, date: a.date, image }),
      ...(a.faqs?.length ? [faqLd(a.faqs)] : []),
    ],
  });

  return (
    <>
      <PageHero crumbs={trail} scene="rings" eyebrow={a.categoryLabel} title={a.title} sub={a.description}>
        <p className="phero__meta">
          <time dateTime={a.date}>{formatDate(a.date)}</time>
          <span><Clock size={14} aria-hidden="true" /> {a.readMins} min read</span>
          <span>By Codefloor IT</span>
        </p>
      </PageHero>

      <article className="section">
        <div className="container article">
          <aside className="article__aside">
            <Toc items={toc} label="In this guide" />
          </aside>
          <div className="article__main">
          <MediaReveal className="article__cover">
            <img src={image} width="1200" height="630" alt="" decoding="async" />
          </MediaReveal>
          <div className="prose">
            {a.body.map((b, i) => (
              <Block key={i} b={b} />
            ))}
          </div>

          {a.faqs?.length > 0 && (
            <>
              <h2 className="h-small h-small--gap">Frequently asked questions</h2>
              <FaqList faqs={a.faqs} />
            </>
          )}

          <ul className="linkrow linkrow--gap">
            {service && <li><ArrowLink to={`/services/${service.slug}`}>Service: {service.title}</ArrowLink></li>}
            {project && <li><ArrowLink to={`/work/${project.slug}`}>Project: {project.title}</ArrowLink></li>}
            <li><ArrowLink to="/contact">Talk to us about your project</ArrowLink></li>
          </ul>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section tint">
          <div className="container">
            <h2 className="shead__title">Keep reading</h2>
            <div className="grid grid--3 grid--top">
              {related.map((r, i) => (
                <ArticleCard key={r.slug} article={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
