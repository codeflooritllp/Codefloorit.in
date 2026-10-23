import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { ArrowLink, Reveal, StatusBadge } from "./ui";
import ServiceGlyph from "./ServiceGlyph";

export function ServiceCard({ service, index }) {
  const Icon = service.icon;
  return (
    <Reveal as="article" delay={(index % 3) * 90} className="card spot scard">
      <span className="scard__n" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="scard__art"><ServiceGlyph slug={service.slug} /></div>
      <div className="scard__text">
        <span className="icon-tile"><Icon size={24} aria-hidden="true" /></span>
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <ArrowLink to={`/services/${service.slug}`}>
          Learn more<span className="sr-only"> about {service.title}</span>
        </ArrowLink>
      </div>
    </Reveal>
  );
}

/** Abstract illustration for a solution category: icon + the kinds of screens involved. */
export function SolutionArt({ solution }) {
  const Icon = solution.icon;
  return (
    <div className="sart" aria-hidden="true">
      <span className="sart__icon"><Icon size={30} /></span>
      <div className="sart__chips">
        {solution.chips.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </div>
  );
}

export function SolutionCard({ solution, index }) {
  return (
    <Reveal as="article" delay={(index % 3) * 90} className="card spot solcard">
      <SolutionArt solution={solution} />
      <div className="solcard__body">
        <h3>{solution.title}</h3>
        <p>{solution.short}</p>
        <ArrowLink to={`/solutions#${solution.slug}`}>
          What we can build<span className="sr-only"> for {solution.title}</span>
        </ArrowLink>
      </div>
    </Reveal>
  );
}

/** A project's visual: its real screenshot in a browser frame, or — without one — an
    illustrative layout mockup, deliberately abstract so it is not mistaken for the product.
    The mockup page is two screens tall; CSS scrolls it like a site being browsed (see .mock__page). */
export function Mockup({ project: { scene, shot, title } }) {
  if (shot)
    return (
      <div className={`mock mock--${scene}`}>
        <div className="mock__bar" aria-hidden="true"><i /><i /><i /><span /></div>
        <div className="mock__body">
          <img className="mock__shot" src={shot} width="1400" height="671" alt={`${title} website homepage`} loading="lazy" decoding="async" />
        </div>
      </div>
    );
  const health = scene === "healthcare";
  return (
    <div className={`mock mock--${scene}`} aria-hidden="true">
      <div className="mock__bar"><i /><i /><i /><span /></div>
      <div className="mock__body">
        <div className="mock__page">
          <div className="mock__screen">
            {health ? (
              <>
                <div className="mock__side"><b /><b /><b /><b /></div>
                <div className="mock__main">
                  <div className="mock__tiles"><b /><b /><b /></div>
                  <div className="mock__rows"><b /><b /><b /><b /></div>
                </div>
              </>
            ) : (
              <div className="mock__main">
                <div className="mock__hero">
                  <span /><span /><em />
                </div>
                <div className="mock__tiles"><b /><b /><b /></div>
              </div>
            )}
          </div>
          <div className="mock__screen">
            {health && <div className="mock__side"><b /><b /><b /><b /></div>}
            <div className="mock__main">
              <div className="mock__rows"><b /><b /><b /><b /><b /></div>
              <div className="mock__tiles"><b /><b /><b /></div>
              {!health && <i className="mock__foot" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project, index }) {
  return (
    <Reveal as="article" delay={(index % 3) * 90} className={`card spot pcard pcard--${project.scene}`} from="scale">
      <div className="pcard__media">
        <Mockup project={project} />
        {!project.shot && <span className="pcard__tag">Illustrative mockup</span>}
        <span className="pcard__go" aria-hidden="true"><ArrowUpRight size={20} /></span>
      </div>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span>{project.category}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3>
          <Link to={`/work/${project.slug}`} className="stretched">{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <ul className="tags" aria-label="Technology">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="alink" aria-hidden="true">View case study <ArrowUpRight size={16} /></span>
      </div>
    </Reveal>
  );
}
