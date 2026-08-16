export type ProjectKind = "Development" | "Writing";
export type ProjectStatus = "In progress" | "Complete" | "Experiment" | "Draft";

export type Project = {
  slug: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  status: ProjectStatus;
  year: string;
  tags: string[];
  body: string[];
  updates?: string[];
};

export const site = {
  name: "Acornaut",
  role: "Developer and writer",
  intro: "A Developer who does modding and writing on the side.",
  about:
    "I am a software developer in the Energy Industry, but many people online know me as Acorn. " +
    "I enjoy reading, writing, and modding Hytale. I am an Admin on Kweebec Corner's server, and a " +
    "recurring contributor to Hytale Thankmas, a charity event that is held every year.",
  githubUrl: "https://github.com/acornaut",
  youtubeUrl: "https://youtube.com/@acornaut",
  twitterUrl: "https://x.com/the_acornaut",
  twitchUrl: "https://twitch.tv/theacornaut",
  email: "contact@acornaut.net",
};

type Frontmatter = Record<string, string>;

const projectFiles = import.meta.glob("./content/projects/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function frontmatter(
  raw: string,
  fileName: string,
): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${fileName} needs a frontmatter block.`);

  const data = Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator === -1)
          throw new Error(
            `${fileName} has an invalid frontmatter line: ${line}`,
          );
        return [
          line.slice(0, separator).trim(),
          line.slice(separator + 1).trim(),
        ];
      }),
  );

  return { data, body: match[2].trim() };
}

function toProject(fileName: string, raw: string): Project {
  const { data, body } = frontmatter(raw, fileName);
  const required = [
    "kind",
    "title",
    "summary",
    "status",
    "year",
    "tags",
  ] as const;
  required.forEach((field) => {
    if (!data[field]) throw new Error(`${fileName} is missing '${field}'.`);
  });

  if (data.kind !== "Development" && data.kind !== "Writing")
    throw new Error(`${fileName} has an invalid kind.`);
  if (!["In progress", "Complete", "Experiment", "Draft"].includes(data.status))
    throw new Error(`${fileName} has an invalid status.`);

  return {
    slug: fileName.split("/").pop()!.replace(/\.md$/, ""),
    kind: data.kind,
    title: data.title,
    summary: data.summary,
    status: data.status as ProjectStatus,
    year: data.year,
    tags: data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    body: body
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
      .filter(Boolean),
    updates: data.updates
      ?.split("|")
      .map((update) => update.trim())
      .filter(Boolean),
  };
}

// Every Markdown file in content/projects becomes a project page automatically.
export const projects = Object.entries(projectFiles)
  .map(([fileName, raw]) => toProject(fileName, raw))
  .sort(
    (first, second) =>
      second.year.localeCompare(first.year) ||
      first.title.localeCompare(second.title),
  );

export const stack = [
  "Java",
  "Hytale",
  "TypeScript",
  "React",
  "C#",
  ".NET",
  "SQL",
  "Git",
];
