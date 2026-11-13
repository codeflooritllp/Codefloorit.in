import { useSeo, breadcrumbLd, crumbs, itemListLd } from "../lib/seo";
import { projects } from "../data/projects";
import { CtaBand, PageHero } from "../components/ui";
import { BigWord, HorizontalShowcase } from "../components/editorial";

const trail = crumbs({ name: "Our Work", path: "/work" });

export default function Work() {
  useSeo({
    title: "Selected Work & Digital Experiences",
    description:
      "Projects by Codefloor IT across legal, hospitality and healthcare — with honest labels for what is completed and what is still in development.",
    path: "/work",
    pageType: "CollectionPage",
    jsonLd: [breadcrumbLd(trail), itemListLd(projects.map((p) => ({ name: p.title, path: `/work/${p.slug}` })))],
  });

  return (
    <>
      <PageHero
        crumbs={trail}
        scene="windows"
        eyebrow="Our work"
        title="Selected Work & Digital Experiences"
        sub="Real projects, described as they are — including what is still in development."
      />
      <section className="section work-intro">
        <BigWord>Selected</BigWord>
        <div className="container">
          <p className="lede">
            <em>Every project here is real.</em> Scroll through each one, then open its case study for the
            challenge, the approach and where it stands today.
          </p>
        </div>
      </section>
      <HorizontalShowcase projects={projects} />
      <section className="section section--tight">
        <div className="container">
          <p className="notice notice--plain">
            Completed projects show screenshots of the delivered websites. Projects still in development show an
            illustrative layout mockup, not a product screenshot.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
