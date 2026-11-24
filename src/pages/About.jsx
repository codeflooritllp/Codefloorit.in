import { Check } from "lucide-react";
import { useSeo, breadcrumbLd, crumbs, SITE_URL } from "../lib/seo";
import { CONTACT, PRINCIPLES, TEAM, whatsappLink } from "../data/site";
import { CtaBand, PageHero, Reveal, SectionHeading } from "../components/ui";
import { ProcessSection, Testimonials, WhySection } from "../components/sections";
import { BigWord, MediaReveal, Stagger } from "../components/editorial";
import { Workspace } from "../components/Illustrations";

const trail = crumbs({ name: "About Us", path: "/about" });

export default function About() {
  useSeo({
    title: "About Codefloor IT — Software Company in Ahmedabad",
    description:
      "Codefloor IT is a software and web development company in Ahmedabad, Gujarat. We learn how your business works first, then build practical software.",
    path: "/about",
    pageType: "AboutPage",
    jsonLd: [
      breadcrumbLd(trail),
      ...TEAM.map((t) => ({
        "@context": "https://schema.org",
        "@type": "Person",
        name: t.name,
        jobTitle: t.role,
        worksFor: { "@id": `${SITE_URL}/#organization` },
        knowsAbout: t.expertise,
      })),
    ],
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        eyebrow="About us"
        title="Built on Engineering. Driven by Possibility."
        sub="Codefloor IT is a technology-focused development company that turns business requirements into practical, well-built digital products."
      />

      <section className="section about-belief">
        <BigWord>Engineering</BigWord>
        <div className="container split split--top">
          <div>
            <SectionHeading eyebrow="What we believe" title="Software should fit the business, not the other way around" />
            <MediaReveal className="about-art">
              <Workspace />
            </MediaReveal>
          </div>
          <Reveal delay={100} className="prose">
            <p>
              Businesses often end up bending their work around generic software, or commissioning
              something that looks impressive on launch day and is painful to change afterwards. We
              try to avoid both.
            </p>
            <p>
              Our work starts with understanding the requirement: who will use the product, what they
              need to get done, and how the business runs today. From there we design clear
              interfaces, build maintainable software, and keep you informed at every stage.
            </p>
            <p>
              We would rather describe our work accurately than oversell it. You will not find
              invented statistics or borrowed client logos on this site — only what we do and how
              we do it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <SectionHeading eyebrow="Principles" title="What guides every project" />
          <Stagger as="ol" className="alist alist--2">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title}>
                <span className="alist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      {TEAM.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Leadership" title={TEAM.length > 1 ? "The people behind Codefloor IT" : "Meet the founder"} />
            {TEAM.map((t) => (
              <Reveal as="article" key={t.name} className="card spot panel team">
                <div>
                  {t.photo && <img src={t.photo} width="96" height="96" alt="" loading="lazy" decoding="async" className="team__photo" />}
                  <h3>{t.name}</h3>
                  <p className="team__role">{t.role}, Codefloor IT Tech LLP</p>
                  <p>{t.bio}</p>
                  {t.quote && <blockquote className="team__quote"><p>“{t.quote}”</p></blockquote>}
                </div>
                {t.expertise && (
                  <div>
                    <h4 className="team__h">Areas of expertise</h4>
                    <ul className="checks">
                      {t.expertise.map((x) => (
                        <li key={x}><Check size={16} aria-hidden="true" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <ProcessSection />
      <WhySection />
      <Testimonials />

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading eyebrow="Company details" title="Who you will be working with" />
          <Reveal>
            <dl className="facts">
              <div><dt>Registered name</dt><dd>Codefloor IT Tech LLP</dd></div>
              <div><dt>Based in</dt><dd>{CONTACT.location}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
              <div><dt>Phone</dt><dd><a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></dd></div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={whatsappLink("Hello Codefloor IT, I would like to discuss a project.")} target="_blank" rel="noopener noreferrer">
                    Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div><dt>Who we work with</dt><dd>Businesses in Ahmedabad, across Gujarat and India, and international clients over video calls</dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
