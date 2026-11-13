import { Link, useParams } from "react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { useSeo, breadcrumbLd, creativeWorkLd, crumbs } from "../lib/seo";
import { getProject, projects } from "../data/projects";
import { getArticle } from "../data/insights";
import { ArrowLink, CtaBand, PageHero, Reveal, StatusBadge } from "../components/ui";
import { Mockup } from "../components/cards";
import { BigWord, MediaReveal, Stagger } from "../components/editorial";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);
  return p ? <Detail p={p} /> : <NotFound />;
}

function Detail({ p }) {
  const path = `/work/${p.slug}`;
  const trail = crumbs({ name: "Our Work", path: "/work" }, { name: p.title, path });

  useSeo({
    title: p.seoTitle,
    description: p.seoDescription,
    path,
    jsonLd: [breadcrumbLd(trail), creativeWorkLd({ title: p.title, description: p.description, path, category: p.category })],
  });

  const chapters = [
    ["Overview", [p.overview]],
    ["The challenge", [p.challenge]],
    ["Our approach", p.approach],
    ["The solution", [p.solution, p.ux]],
    [p.status === "Completed" ? "Outcome" : "Current status", [p.outcome]],
  ];
  const others = projects.filter((o) => o.slug !== p.slug);

  return (
    <>
      <PageHero crumbs={trail} scene="windows" eyebrow={p.category} title={p.title} sub={p.summary}>
        <StatusBadge status={p.status} />
      </PageHero>

      <section className="section pcover">
        <div className="container">
          <MediaReveal className="pcover__media">
            <Mockup project={p} />
          </MediaReveal>
          <dl className="pfacts">
            <div><dt>Industry</dt><dd>{p.industry}</dd></div>
            <div><dt>Status</dt><dd><StatusBadge status={p.status} /></dd></div>
            <div><dt>Technology</dt><dd>{p.tech.join(" · ")}</dd></div>
            <div>
              <dt>{p.shot ? "Visual" : "Note"}</dt>
              <dd>
                {p.shot ? "Homepage of the delivered website." : "Illustrative mockup, not a product screenshot."}
                {p.live && (
                  <a href={p.live} className="alink" target="_blank" rel="noopener noreferrer">
                    Visit the live website <ArrowUpRight size={16} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section chapters">
        <BigWord>{p.industry}</BigWord>
        <div className="container">
          {chapters.map(([title, paras], i) => (
            <Reveal as="section" key={title} className="chapter" aria-labelledby={`ch-${i}`}>
              <p className="chapter__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
              <h2 id={`ch-${i}`}>{title}</h2>
              <div className="prose">
                {paras.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <h2 className="shead__title">Features</h2>
          <Stagger className="grid grid--3 grid--top">
            {p.featureGroups.map((g) => (
              <div key={g.h} className="card spot panel">
                <h3>{g.h}</h3>
                <ul className="checks">
                  {g.items.map((it) => (
                    <li key={it}><Check size={16} aria-hidden="true" /> {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Stagger>
          {p.relatedInsights?.length > 0 && (
            <div className="pread">
              <h2 className="h-small">Related reading</h2>
              <ul className="linkcol">
                {p.relatedInsights.map((s) => (
                  <li key={s}><ArrowLink to={`/insights/${s}`}>{getArticle(s).title}</ArrowLink></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="shead__title">More projects</h2>
          <ul className="pnext">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/work/${o.slug}`}>
                  <span className="pnext__cat">{o.category}</span>
                  <span className="pnext__title">{o.title}</span>
                  <ArrowUpRight size={28} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Planning something similar?" sub="Tell us about your requirements and we will give you an honest read on scope and approach." />
    </>
  );
}
