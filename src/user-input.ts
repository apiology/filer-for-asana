export type UserInput = {
  raw: string
  project: string | null
  section: string | null
  remaining: string
}

const parseProject = (raw: string): {
  rawMinusProject: string
  project: string | null
} => {
  let project = null;
  let rawMinusProject = raw;
  const index = raw.lastIndexOf('#');
  if (index !== -1) {
    rawMinusProject = raw.substring(0, index);
    project = raw.substring(index + 1)?.trim();
  }
  return { rawMinusProject, project };
};

const parseSection = (raw: string): {
  rawMinusSection: string
  section: string | null
} => {
  let section = null;
  let rawMinusSection = raw;
  const index = raw.lastIndexOf('.');
  if (index !== -1) {
    const sectionText = raw.substring(index + 1)?.trim();
    const projectHintProvidedAfterwards = sectionText.includes('#');
    const noTextProvided = sectionText.length === 0;
    if (!projectHintProvidedAfterwards && !noTextProvided) {
      section = sectionText;
      rawMinusSection = raw.substring(0, index);
    }
  }
  return { rawMinusSection, section };
};

export const parseUserInput = (raw: string): UserInput => {
  const { rawMinusSection, section } = parseSection(raw);
  const { rawMinusProject, project } = parseProject(rawMinusSection);
  return {
    raw,
    project,
    section,
    remaining: rawMinusProject.trim(),
  };
};
