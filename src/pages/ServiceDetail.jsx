import { useParams } from "react-router";
import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs, faqLd, serviceLd } from "../lib/seo";
import { getService, services } from "../data/services";
import { projects } from "../data/projects";
import { getArticle } from "../data/insights";
import { ArrowLink, Btn, CtaBand, FaqList, PageHero, Reveal, SectionHeading } from "../components/ui";
import { ProjectCard } from "../components/cards";
import { BigWord, MediaReveal, Stagger } from "../components/editorial";
import ServiceGlyph from "../components/ServiceGlyph";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  return s ? <Detail s={s} /> : <NotFound />;
}

function Detail({ s }) {
  const path = `/services/${s.slug}`;
  const trail = crumbs({ name: "Services", path: "/services" }, { name: s.title, path });
  const related = projects.filter((p) => s.projects.includes(p.slug));
  const reading = (s.reading ?? []).map(getArticle).filter(Boolean);
  const Icon = s.icon;

  useSeo({
    title: s.seoTitle,
    description: s.seoDescription ?? `${s.title} by Codefloor IT, Ahmedabad. ${s.short}`,
    path,
    jsonLd: [breadcrumbLd(trail), serviceLd({ name: s.title, description: s.short, path }), faqLd(s.faqs)],
  });

  return (
    <>
      <PageHero crumbs={trail} scene="laptop" eyebrow="Service" title={s.title} sub={s.short}>
        <div className="actions">
          <Btn to={`/contact?service=${s.slug}`} magnetic arrow>Discuss your project</Btn>
        </div>
      </PageHero>

      <section className="section sdintro">
        <BigWord>{s.title.split(" ")[0]}</BigWord>
        <div className="container split">
          <div>
            <Reveal>
              <span className="icon-tile icon-tile--lg"><Icon size={30} aria-hidden="true" /></span>
              <p className="lead">{s.intro}</p>
            </Reveal>
            <MediaReveal className="sdintro__art">
              <div className="sdintro__stage" aria-hidden="true"><ServiceGlyph slug={s.slug} /></div>
            </MediaReveal>
          </div>
          <Reveal delay={100} className="card spot panel">
            <h2>What we build</h2>
            <ul className="checks">
              {s.build.map((b) => (
                <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {s.problems && (
        <section className="section tint">
          <div className="container split">
            <div>
              <SectionHeading title="Problems we solve" />
              <Reveal>
                <ul className="checks">
                  {s.problems.map((p) => (
                    <li key={p}><Check size={16} aria-hidden="true" /> {p}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={100} className="card spot panel">
              <h2>Technology we use</h2>
              <ul className="tags" aria-label="Technology">
                {s.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="notice notice--plain">Chosen to fit each project; not every tool is used on every build.</p>
            </Reveal>
          </div>
        </section>
      )}

      {s.local && (
        <section className="section">
          <div className="container container--narrow">
            <SectionHeading eyebrow="Where we work" title="Working with businesses in Ahmedabad" />
            <Reveal>
              <p className="lead">{s.local}</p>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section tint">
        <div className="container">
          <SectionHeading eyebrow="Approach" title="How we handle it" />
          <Stagger as="ol" className="alist">
            {s.approach.map((a, i) => (
              <li key={a.h}>
                <span className="alist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Related work" title="Projects involving this kind of work" />
            <div className="grid grid--3">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${related.length ? "tint" : ""}`}>
        <div className="container container--narrow">
          <SectionHeading center eyebrow="FAQ" title={`${s.title}: common questions`} />
          <FaqList faqs={s.faqs} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {reading.length > 0 && (
            <>
              <h2 className="h-small">Related reading</h2>
              <ul className="linkrow">
                {reading.map((a) => (
                  <li key={a.slug}><ArrowLink to={`/insights/${a.slug}`}>{a.title}</ArrowLink></li>
                ))}
              </ul>
            </>
          )}
          <h2 className={`h-small ${reading.length ? "h-small--gap" : ""}`}>Other services</h2>
          <ul className="linkrow">
            {services.filter((o) => o.slug !== s.slug).map((o) => (
              <li key={o.slug}><ArrowLink to={`/services/${o.slug}`}>{o.title}</ArrowLink></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
