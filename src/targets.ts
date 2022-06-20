import * as Asana from 'asana';
import { fetchClient, fetchWorkspaceGid } from './asana-base.js';

type Target = {
  project: Asana.resources.Projects.Type | null,
  section: Asana.resources.Sections.Type,
}

export const addSectionsToTargets = async (
  projectGid: string,
  project: Asana.resources.Projects.Type | null,
  sectionName: string | null,
  targets: Target[]
): Promise<void> => {
  const client = await fetchClient();
  const sections = await client.sections.findByProject(projectGid);

  // 1. add each section discovered via search
  if (sectionName != null) {
    for (const section of sections.slice(1)) {
      if (section.name == null) {
        throw Error('name not included in results!');
      }
      if (section.name.includes(sectionName)) {
        targets.push({ project, section });
      }
    }
    // ensure closest match (smallest section name used as a proxy) is first
    targets.sort((a, b) => {
      if (a.section.name == null) {
        throw Error('name not included in results!');
      }
      if (b.section.name == null) {
        throw Error('name not included in results!');
      }
      return a.section.name.length - b.section.name.length;
    });
  }
  // 2. add default section at end of list
  targets.push({ project, section: sections[0] });
};

export const targetSections = async (
  projectTargets: Asana.resources.ResourceList<Asana.resources.Projects.Type> | null,
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
    await Promise.all(projectTargets.data.map((
      project
    ) => addSectionsToTargets(project.gid, project, sectionName, targets)));
  }

  return targets;
};
