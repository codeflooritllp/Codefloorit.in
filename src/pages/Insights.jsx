import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs, itemListLd } from "../lib/seo";
import { articles, CATEGORIES } from "../data/insights";
import { CtaBand, PageHero, Reveal } from "../components/ui";

const trail = crumbs({ name: "Insights", path: "/insights" });
const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-02-10" -> "10 Feb 2026" without locale-dependent formatting. */
export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function ArticleCard({ article, index = 0 }) {
  return (
    <Reveal as="article" delay={(index % 3) * 90} className="card spot acard">
      <p className="acard__cat">{article.categoryLabel}</p>
      <h3>
        <Link to={`/insights/${article.slug}`} className="stretched">{article.title}</Link>
      </h3>
      <p>{article.description}</p>
      <p className="acard__meta">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span><Clock size={14} aria-hidden="true" /> {article.readMins} min read</span>
      </p>
    </Reveal>
  );
}

export default function Insights() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const featured = latest[0];
  const browsing = cat === "all" && !q; // the featured article leads the page until a filter is used
  const shown = latest.filter(
    (a) => (cat === "all" || a.category === cat) && (!q || `${a.title} ${a.description} ${a.categoryLabel}`.toLowerCase().includes(q)) && !(browsing && a === featured)
  );

  useSeo({
    title: "Insights — Practical Guides on Websites & Business Software",
    description:
      "Plain-language guides from Codefloor IT on business websites, custom software, hotel booking systems and patient management software.",
    path: "/insights",
    pageType: "CollectionPage",
    jsonLd: [breadcrumbLd(trail), itemListLd(articles.map((a) => ({ name: a.title, path: `/insights/${a.slug}` })))],
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="rings"
        eyebrow="Insights"
        title="Practical answers before you start a project"
        sub="Plain-language guides to the questions businesses ask us about websites and software."
      />
      {browsing && (
        <section className="section section--tight">
          <div className="container">
            <article className="feat">
              <div className="feat__media">
                <img src={`/og/${featured.slug}.png`} width="1200" height="630" alt="" loading="lazy" decoding="async" />
              </div>
              <div className="feat__body">
                <p className="acard__cat">Latest · {featured.categoryLabel}</p>
                <h2>
                  <Link to={`/insights/${featured.slug}`} className="stretched">{featured.title}</Link>
                </h2>
                <p>{featured.description}</p>
                <p className="acard__meta">
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span><Clock size={14} aria-hidden="true" /> {featured.readMins} min read</span>
                </p>
                <span className="alink" aria-hidden="true">Read the guide <ArrowUpRight size={16} /></span>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="section tint">
        <div className="container">
          <div className="ibar">
            <fieldset className="filters">
              <legend className="sr-only">Filter articles by topic</legend>
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </fieldset>
            <label className="isearch">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Search articles</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guides" />
            </label>
          </div>
          <p className="sr-only" aria-live="polite">{shown.length} articles shown</p>
          {shown.length ? (
            <div className="grid grid--3">
              {shown.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          ) : (
            <p className="iempty">No guides match “{query}”. Try another word, or <Link to="/contact" className="alink">ask us directly</Link>.</p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
