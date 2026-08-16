import { useEffect, useState } from "react";
import { FaGithub, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import AsciiObject from "./components/canvasui/AsciiObject";
import {
  projects,
  site,
  stack,
  type Project,
  type ProjectKind,
} from "./content";

type Route =
  { page: "home" } | { page: "projects" } | { page: "detail"; slug: string };
type Filter = "All" | ProjectKind;

function readRoute(): Route {
  const [section, slug] = window.location.hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean);
  if (section === "projects" && slug) return { page: "detail", slug };
  if (section === "projects") return { page: "projects" };
  return { page: "home" };
}

function TitleWithCursor({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const lastWord = words.pop() ?? "";
  const beginning = words.join(" ");

  return (
    <>
      {beginning ? `${beginning} ` : null}
      <span className="title-tail">
        {lastWord}
        <span className="cursor" aria-hidden="true">
          _
        </span>
      </span>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="project-card" href={`#/projects/${project.slug}`}>
      <p className="project-meta">
        {project.kind} / {project.status} / {project.year}
      </p>
      <h3>
        {project.title}
        <span aria-hidden="true"> -&gt;</span>
      </h3>
      <p>{project.summary}</p>
      <ul aria-label={`${project.title} tags`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </a>
  );
}

function EmptyProjects() {
  return (
    <div className="empty-collection">
      <strong>[ no projects here yet ]</strong>
      <p>
        Add a Markdown file to <code>src/content/projects</code> and set its{" "}
        <code>kind</code> to Development or Writing. It will show up here
        automatically.
      </p>
    </div>
  );
}

function ProjectGrid({ filter }: { filter: Filter }) {
  const visible =
    filter === "All"
      ? projects
      : projects.filter((project) => project.kind === filter);
  return visible.length ? (
    <div className="project-grid">
      {visible.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  ) : (
    <EmptyProjects />
  );
}

function Home() {
  const developmentCount = projects.filter(
    (project) => project.kind === "Development",
  ).length;
  const writingCount = projects.filter(
    (project) => project.kind === "Writing",
  ).length;
  return (
    <>
      <section className="intro section-shell" aria-labelledby="intro-heading">
        <div className="intro-copy">
          <p className="signal">// {site.role.toUpperCase()}</p>
          <h1 id="intro-heading" className="wordmark">
            <TitleWithCursor title="ACORNAUT" />
          </h1>
          <p className="aka">AKA Acorn</p>
          <p className="lead">{site.intro}</p>
          <a className="text-button" href="#/projects">
            [ explore projects ]
          </a>
        </div>
        <AsciiObject
          className="ascii-object"
          src="/acorn-ascii.png"
          ascii
          cellSize={8}
          cellAspect={0.62}
          charset=" .,:;i1tfLCG08@"
          colored
          contrast={1.65}
          edgeContrast={3}
          exposure={1.05}
          background="#050707"
          highlight="#d8b98b"
          environmentIntensity={0.85}
          scale={5.25}
          floatIntensity={0.35}
          rotationIntensity={0.2}
          floatSpeed={0.8}
          orbit={false}
          zoom={false}
        />
      </section>
      <section className="status section-shell" aria-label="Site highlights">
        <span>
          <b>{String(developmentCount).padStart(2, "0")}</b> development
          projects
        </span>
        <span>
          <b>{String(writingCount).padStart(2, "0")}</b> writing projects
        </span>
        <span>
          <b className="status-infinity" aria-label="infinity">
            ∞
          </b>{" "}
          Acorns
        </span>
      </section>
      <section
        className="projects section-shell"
        aria-labelledby="projects-heading"
      >
        <div className="section-heading">
          <div>
            <p className="signal">// PROJECT ARCHIVE</p>
            <h2 id="projects-heading">Recent work</h2>
          </div>
          <a href="#/projects">view everything -&gt;</a>
        </div>
        <ProjectGrid filter="All" />
      </section>
      <section
        id="about"
        className="about section-shell"
        aria-labelledby="about-heading"
      >
        <p className="signal">// ABOUT</p>
        <h2 id="about-heading">Who I am</h2>
        <p>{site.about}</p>
      </section>
    </>
  );
}

function Listing() {
  const [filter, setFilter] = useState<Filter>("All");
  return (
    <section className="listing section-shell">
      <p className="signal">// PROJECT ARCHIVE</p>
      <h1>
        <TitleWithCursor title="All projects" />
      </h1>
      <p className="lead">
        Development work, Hytale mods, stories, essays, and experiments. One
        shelf for everything.
      </p>
      <div className="filters" aria-label="Filter projects">
        {(["All", "Development", "Writing"] as Filter[]).map((option) => (
          <button
            key={option}
            className={filter === option ? "active" : ""}
            type="button"
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <ProjectGrid filter={filter} />
    </section>
  );
}

function Detail({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug);
  if (!project)
    return (
      <section className="listing section-shell">
        <p className="signal">// 404</p>
        <h1>That page wandered off.</h1>
        <a className="text-button" href="#/projects">
          [ back to projects ]
        </a>
      </section>
    );
  return (
    <article className="detail section-shell">
      <a className="back-link" href="#/projects">
        &lt;- project archive
      </a>
      <p className="signal">
        // {project.kind.toUpperCase()} / {project.status.toUpperCase()} /{" "}
        {project.year}
      </p>
      <h1>
        <TitleWithCursor title={project.title} />
      </h1>
      <p className="lead">{project.summary}</p>
      <ul className="detail-tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="article-body">
        {project.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {project.updates?.length ? (
        <section className="updates">
          <h2>Build log</h2>
          <ol>
            {project.updates.map((update) => (
              <li key={update}>{update}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const year = new Date().getFullYear();
  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const page =
    route.page === "home" ? (
      <Home />
    ) : route.page === "detail" ? (
      <Detail slug={route.slug} />
    ) : (
      <Listing />
    );
  return (
    <main>
      <header className="topbar section-shell">
        <a href="#/" className="brand">
          ACORNAUT
        </a>
        <nav aria-label="Main navigation">
          <a href="#/projects">Projects</a>
          <a href="#about">About</a>
        </nav>
      </header>
      {page}
      <section
        className="toolkit section-shell"
        aria-labelledby="toolkit-heading"
      >
        <p className="signal">// Experience</p>
        <h2 id="toolkit-heading">Skills</h2>
        <ul>
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <footer className="section-shell">
        <span>
          &copy; {year} {site.name}
        </span>
        <span>
          Contact: <a href={`mailto:${site.email}`}>contact@acornaut.net</a>
        </span>
        <nav className="social-links" aria-label="Social links">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <FaGithub aria-hidden="true" />
          </a>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            title="YouTube"
          >
            <FaYoutube aria-hidden="true" />
          </a>
          <a
            href={site.twitterUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            title="Twitter"
          >
            <FaTwitter aria-hidden="true" />
          </a>
          <a
            href={site.twitchUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Twitch"
            title="Twitch"
          >
            <FaTwitch aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default App;
