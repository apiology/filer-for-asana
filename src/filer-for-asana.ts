/**
 * filer-for-asana module.
 *
 * Quickly creates Asana tasks from the Chrome Omnibox and Alfred workflows.
 */

import * as Asana from 'asana';
import { fetchClient, fetchWorkspaceGid } from './asana-base.js';
import { platform } from './platform.js';
import { pullResult } from './asana-typeahead.js';
import { UserInput, parseUserInput } from './user-input.js';

export const logSuccess = (result: string | object): void => {
  const logger = platform().logger();
  logger.log('Acted:', result);
};

// a potential item presented to user for selection
export type Suggestion = {
  url: string
  text: string
  description: string
}

export const suggestProjects = async (project: string | null):
  Promise<Asana.resources.ResourceList<Asana.resources.Projects.Type> | null> => {
  if (project == null) {
    return null;
  }
  return pullResult(project, 'project', []);
};

export const addSectionsToSuggestions = async (
  projectGid: string,
  project: Asana.resources.Projects.Type | null,
  sectionName: string | null,
  suggestions: {
    project: Asana.resources.Projects.Type | null,
    section: Asana.resources.Sections.Type,
  }[]
) => {
  const client = await fetchClient();
  const sections = await client.sections.findByProject(projectGid);
  const p = platform();
  const logger = p.logger();

  // 1. add each section discovered via search
  if (sectionName != null) {
    for (const section of sections.slice(1)) {
      if (section.name == null) {
        throw Error('name not included in results!');
      }
      if (section.name.includes(sectionName)) {
        suggestions.push({ project, section });
        logger.log(`matched ${section.name}`, { suggestions }, sectionName);
      } else {
        logger.log(`did not match ${section.name}`, { suggestions }, sectionName);
      }
    }
    // ensure closest match (smallest section name used as a proxy) is first
    suggestions.sort((a, b) => {
      if (a.section.name == null) {
        throw Error('name not included in results!');
      }
      if (b.section.name == null) {
        throw Error('name not included in results!');
      }
      return a.section.name.length - b.section.name.length;
    });
  }
  logger.log('done', { suggestions });
  // 2. add default section at end of list
  suggestions.push({ project, section: sections[0] });
  logger.log('really done', { suggestions });
};

type ProjectAndSection = {
  project: Asana.resources.Projects.Type | null,
  section: Asana.resources.Sections.Type,
}

export const suggestSections = async (
  projectSuggestions: Asana.resources.ResourceList<Asana.resources.Projects.Type> | null,
  sectionName: string | null
): Promise<ProjectAndSection[]> => {
  const client = await fetchClient();
  const suggestions: ProjectAndSection[] = [];
  if (projectSuggestions == null) {
    if (sectionName != null) {
      // user didn't provide a project; let's assume they meant the user task list
      const workspaceGid = await fetchWorkspaceGid();
      const userTaskList = await client.userTaskLists.findByUser('me', { workspace: workspaceGid });
      await addSectionsToSuggestions(userTaskList.gid, null, sectionName, suggestions);
    }
  } else {
    await Promise.all(projectSuggestions.data.map((
      project
    ) => addSectionsToSuggestions(project.gid, project, sectionName, suggestions)));
  }

  return suggestions;
};

export const generateSuggestions = async (userInput: UserInput): Promise<Suggestion[]> => {
  const p = platform();
  const config = p.config();
  const logger = p.logger();
  const workspaceName = await config.fetchWorkspaceName();
  // TODO: using the word 'suggestion' too much
  const projectSuggestions = await suggestProjects(userInput.project);
  const sectionSuggestions = await suggestSections(projectSuggestions, userInput.section);
  // 1. add item for each of sectionSuggestions
  const suggestions = sectionSuggestions.map(({ project, section }) => {
    const text = userInput.remaining;
    const projectName = project == null ? 'My Tasks' : project.name;
    const description = `File "${text}" in ${workspaceName} / ${projectName} / ${section.name}`;
    const urlObject = new URL(`filer-for-asana:${encodeURIComponent(text)}`);
    urlObject.searchParams.append('section', section.gid);
    const url = urlObject.href;

    return {
      url,
      text,
      description,
    };
  });

  // 2. add a suggestion for the raw text in case user mean '#' more literally
  const text = userInput.raw;
  const description = `File "${text}" in workspace ${workspaceName}`;
  const urlObject = new URL(`filer-for-asana:${encodeURIComponent(text)}`);
  const url = urlObject.href;

  suggestions.push({
    url,
    text,
    description,
  });

  logger.log('generateSuggestions: ', suggestions);

  return suggestions;
};

export const pullSuggestions = async (text: string): Promise<Suggestion[]> => {
  const p = platform();
  const logger = p.logger();
  logger.log(`Got text as [${text}]`);
  const userInput = parseUserInput(text);
  const suggestions = await generateSuggestions(userInput);
  return suggestions;
};

export const actOnInputData = async (text: string) => {
  const client = await fetchClient();
  const workspaceGid = await fetchWorkspaceGid();
  const assignee = await client.users.me();
  const url = new URL(text);
  const sectionGid = url.searchParams.get('section');
  const parsedText = decodeURIComponent(url.pathname);
  let projectGid = null;
  if (sectionGid != null) {
    const section: Asana.resources.Sections.Type = await client.sections.findById(sectionGid);
    projectGid = section.project?.gid;
  }
  const createParams: Asana.resources.Tasks.CreateParams & { workspace: string } = {
    workspace: workspaceGid,
    name: parsedText,
  };
  if (projectGid == null) {
    if (sectionGid == null) {
      createParams.assignee = assignee.gid;
    } else {
      throw Error('Teach me how to assign to user task lists');
    }
  } else if (sectionGid == null) {
    createParams.projects = [projectGid];
  } else {
    createParams.memberships = [{ project: projectGid, section: sectionGid }];
  }
  const task = await client.tasks.create(createParams);
  const status = `Acting upon ${text}: ${JSON.stringify(task)}`;
  return status;
};
