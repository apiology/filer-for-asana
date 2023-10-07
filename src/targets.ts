import * as Asana from 'asana';
import { fetchClient, fetchWorkspaceGid } from './asana-base.js';

export type Target = {
  project: Asana.resources.Projects.Type | null,
  section: Asana.resources.Sections.Type,
}

const matchScore = (name: string, searchString: string): number => {
  let score = 0;

  // penalize longer section names
  score += searchString.length - name.length;

  // promote matches from start of string
  if (name.toLowerCase().indexOf(searchString.toLowerCase()) === 0) {
    score += 10;
  }

  return score;
};

export function prioritizedMatchedSectionTargets<T extends { name?: string }>(
  sections: (T)[],
  searchString: string
): T[] {
  const scoredTargets = [];
  for (const section of sections) {
    if (section.name == null) {
      throw Error('name not included in results!');
    }
    if (section.name.toLowerCase().includes(searchString.toLowerCase())) {
      scoredTargets.push({
        section,
        score: matchScore(section.name, searchString),
      });
    }
  }
  // pick order in which to present
  //
  // ensure closest match (smallest section name used as a proxy) is first
  scoredTargets.sort((a, b) => b.score - a.score);
  return scoredTargets.map((st) => st.section);
}

export const addSectionsToTargets = async (
  projectGid: string,
  project: Asana.resources.Projects.Type | null,
  searchString: string | null,
  targets: Target[]
): Promise<void> => {
  const client = await fetchClient();
  const sections = await client.sections.findByProject(projectGid);

  if (searchString == null) {
    targets.push(...sections.map((section) => ({ project, section })));
  } else {
    // 1. add each section discovered via search
    const sectionTargets = prioritizedMatchedSectionTargets(sections.slice(1), searchString);
    targets.push(...sectionTargets.map((section) => ({ project, section })));
    // 2. add default section at end of list
    if (project != null) {
      // only push the inbox if they explicitly listed a project -
      // there's already an item added at the end for the user task
      // list, and chances are the section hint wasn't intentional
      // anyway.
      const section = sections[0];
      if (section == null) {
        throw Error(`No sections found in ${project} via API call`);
      }

      targets.push({ project, section });
    }
  }
};

export const targetSections = async (
  projectTargets: Asana.resources.Projects.Type[] | null,
  sectionName: string | null
): Promise<Target[]> => {
  const client = await fetchClient();
  const targets: Target[] = [];
  if (projectTargets == null) {
    if (sectionName != null) {
      // user didn't provide a project; let's assume they meant the user task list
      const workspaceGid = await fetchWorkspaceGid();
      const userTaskList = await client.userTaskLists.findByUser('me', { workspace: workspaceGid });
      await addSectionsToTargets(userTaskList.gid, null, sectionName, targets);
    }
  } else {
    await Promise.all(projectTargets.map((
      project
    ) => addSectionsToTargets(project.gid, project, sectionName, targets)));
  }

  return targets;
};
