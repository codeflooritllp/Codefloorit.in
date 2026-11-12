import { ChevronDown } from "lucide-react";
import { useSeo, faqLd } from "../lib/seo";
import { usePointerVars, useScrollProgress } from "../lib/motion";
import { solutions } from "../data/solutions";
import { techGroups } from "../data/tech";
import { HOME_FAQ, PRINCIPLES } from "../data/site";
import { ArrowLink, Btn, FaqList, Marquee, Reveal, SectionHeading, Split } from "../components/ui";
import { SolutionCard } from "../components/cards";
import { ContactSection, ProcessSection, TechShowcase, WhySection } from "../components/sections";
import { KineticStatement, ServiceReel, StoryScene, WorkScene } from "../components/scenes";
import HeroVisual from "../components/HeroVisual";
import Scene3D from "../components/Scene3D";
import SignalDial from "../components/SignalDial";

/* deterministic pseudo-random in [0, 1): the same on the server and in the browser */
const rand = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** "We build digital futures." in oversized type. Each character rises in on load and,
    in the pinned hero, drifts apart as the visitor scrolls (CSS, driven by --p). */
function DisplayLine() {
  let c = 0;
  let g = 0; // position along the gradient, across the highlighted words only
  const word = (text, grad) => (
    <span className="hd__w" key={text}>
      {[...text].map((ch) => {
        const i = c++;
        const style = { "--c": i, "--dx": ((rand(i) - 0.5) * 520).toFixed(0), "--dy": (-80 - rand(i + 7) * 320).toFixed(0), "--r": ((rand(i + 3) - 0.5) * 80).toFixed(0) };
        if (grad) style["--g"] = (g++ / 14).toFixed(3);
        return <span key={i} className={grad ? "hd__c hd__c--g" : "hd__c"} style={style}>{ch}</span>;
      })}
    </span>
  );
  const words = [["We"], ["build"], ["digital", true], ["futures.", true]];
  return (
    <p className="hero__display">
      <span className="sr-only">We build digital futures.</span>
      <span aria-hidden="true">
        {words.map(([w, g], i) => (
          <span key={w}>{word(w, g)}{i < words.length - 1 && " "}</span>
        ))}
      </span>
    </p>
  );
}

/* Pinned opening scene: the wrapper is taller than the viewport, the hero sticks,
   and scroll progress (--p) zooms the camera into the robot while the copy lifts away. */
function Hero() {
  const pointer = usePointerVars();
  const scene = useScrollProgress("pin");
  return (
    <div className="scene scene--hero" ref={scene} data-robot="idle" data-morph>
      <section className="hero" ref={pointer}>
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="gridbg gridbg--drift" aria-hidden="true" />
        <div className="pglow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow hero__in" style={{ "--i": 0 }}>Web &amp; software development · Ahmedabad</p>
            <DisplayLine />
            <h1 className="hero__title hero__in" style={{ "--i": 1 }}>
              {/* words rise out of a mask one by one (CSS, .hero__title .sw); the gradient sits on each word */}
              <Split text="Websites & Software That" /> <Split text="Grow Your Business." start={4} wordClass="grad" />
            </h1>
            <p className="hero__sub hero__in" style={{ "--i": 2 }}>
              From a business website that brings in enquiries to custom software that runs your
              operations, we plan, design, build and support it with you, for businesses across India.
            </p>
            <div className="actions hero__in" style={{ "--i": 3 }}>
              <Btn to="/contact" magnetic arrow>Discuss Your Project</Btn>
              <Btn to="/work" variant="outline">See Our Work</Btn>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__in" style={{ "--i": 2 }}>
              <HeroVisual />
            </div>
          </div>
        </div>
        <a href="#services" className="hero__scroll" aria-label="Scroll to services">
          <ChevronDown size={20} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

export default function Home() {
  useSeo({
    title: "Codefloor IT — Web & Software Development Company in Ahmedabad",
    description:
      "Codefloor IT is a web and software development company in Ahmedabad, Gujarat, building business websites, web applications, e-commerce stores and custom software.",
    path: "/",
    jsonLd: faqLd(HOME_FAQ),
  });

  return (
    <>
      <Scene3D kind="morph" />
      <Hero />
      <Marquee reverse items={techGroups.flatMap((g) => g.items)} />
      <KineticStatement />
      <StoryScene />

      <ServiceReel
        eyebrow="Services"
        title="Technology Built Around Your Ambition"
        sub="Practical engineering and thoughtful design for businesses building their next stage of digital growth."
        action={<ArrowLink to="/services">All services</ArrowLink>}
      />

      <section className="section craft" data-robot="point">
        <div className="container split craft__grid">
          <SectionHeading
            eyebrow="Craft"
            title="Interfaces That Feel Alive"
            sub="We tune timing, motion and feedback until every click, load and transition feels quick and clear. Motion should explain what is happening, never get in the way."
          />
          <SignalDial />
        </div>
      </section>

      <section className="section" data-robot="point" data-morph>
        <div className="container">
          <div className="shead-row">
            <SectionHeading
              eyebrow="Solutions"
              title="Digital Solutions for Real-World Challenges"
              sub="Use cases we can design and build software for. These are solution areas, not a client list."
            />
            <ArrowLink to="/solutions">All solutions</ArrowLink>
          </div>
          <div className="grid grid--3">
            {solutions.map((s, i) => (
              <SolutionCard key={s.slug} solution={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <WorkScene />
      <TechShowcase />

      <section className="section about-teaser" data-robot="idle">
        <div className="container split">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="Built on Engineering. Driven by Possibility."
              sub="Codefloor IT is a technology-focused development company. We take time to understand what a business needs, then build practical, maintainable software around it."
            />
            <Reveal delay={100}>
              <Btn to="/about" variant="outline" arrow>More about us</Btn>
            </Reveal>
          </div>
          <ul className="plist">
            {PRINCIPLES.slice(0, 4).map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80} from="right">
                <span className="plist__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSection />
      <WhySection />

      <section className="section" data-robot="idle">
        <div className="container container--narrow">
          <SectionHeading center eyebrow="FAQ" title="Questions we hear most" />
          <FaqList faqs={HOME_FAQ} />
        </div>
      </section>

      <ContactSection title="Have an Idea? Let's Make It Real." />
    </>
  );
}
