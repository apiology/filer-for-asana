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
import { Target, targetSections } from './targets.js';

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

const createSectionSuggestion = async (
  userInput: UserInput,
  { section, project }: Target
): Promise<Suggestion> => {
  const p = platform();
  const config = p.config();
  const formatter = p.formatter();
  const workspaceName = await config.fetchWorkspaceName();
  const text = userInput.remaining;
  let projectName = 'My Tasks';
  if (project != null) {
    if (project.name === undefined) {
      throw Error('Name not provided on project');
    }
    projectName = project.name;
  }
  if (section.name === undefined) {
    throw Error('Name not provided on section');
  }
  const description = formatter.formatDescriptionWithSection(
    text,
    workspaceName,
    projectName,
    section.name
  );
  const urlObject = new URL(`filer-for-asana:${encodeURIComponent(text)}`);
  urlObject.searchParams.append('section', section.gid);
  const url = urlObject.href;

  return {
    url,
    text,
    description,
  };
};

const preferCompleteNames = (
  projectName: string,
  projectTargets: Asana.resources.ResourceList<Asana.resources.Projects.Type>
): Asana.resources.Projects.Type[] => {
  // segment projectTargets.data into ones which exactly match projectName and those that don't
  const exactMatches = projectTargets.data.filter((project) => project.name === projectName);
  const partialMatches = projectTargets.data.filter((project) => project.name !== projectName);
  // return exact matches first, then partial matches
  return exactMatches.concat(partialMatches);
};

const createMyTasksInboxSuggestion = async (
  userInput: UserInput
): Promise<Suggestion> => {
  const p = platform();
  const config = p.config();
  const formatter = p.formatter();
  const workspaceName = await config.fetchWorkspaceName();
  const text = userInput.raw;
  const description = formatter.formatDescriptionJustWorkspace(text, workspaceName);
  const urlObject = new URL(`filer-for-asana:${encodeURIComponent(text)}`);
  const url = urlObject.href;

  return { url, text, description };
};

export const pullSuggestions = async (userText: string): Promise<Suggestion[]> => {
  const p = platform();
  const logger = p.logger();
  logger.log(`Got text as [${userText}]`);

  const userInput = parseUserInput(userText);

  let projectTargets: Asana.resources.Projects.Type[] | null = null;
  if (userInput.project != null) {
    const rawProjectTargets = await pullResult(userInput.project, 'project', 'name');
    projectTargets = preferCompleteNames(userInput.project, rawProjectTargets);
  }
  const sectionTargets = await targetSections(projectTargets, userInput.section);

  // add item for each of sectionTargets
  const suggestions = await Promise.all(sectionTargets.map(
    (target) => createSectionSuggestion(userInput, target)
  ));

  // add a suggestion for the raw text in case user mean '#' more literally
  suggestions.push(await createMyTasksInboxSuggestion(userInput));

  return suggestions;
};

const generateTaskCreateParams = async (
  parsedText: string,
  projectGid: string | null,
  sectionGid: string | null
):
  Promise<Asana.resources.Tasks.CreateParams & { workspace: string }> => {
  const client = await fetchClient();
  const assignee = await client.users.me();
  const workspaceGid = await fetchWorkspaceGid();
  let notes;
  let name;
  if (parsedText.match(/^(https?:\/\/)/)) {
    const url = parsedText;
    name = url;
    notes = url;
  } else {
    name = parsedText;
  }
  const createParams: Asana.resources.Tasks.CreateParams & { workspace: string } = {
    workspace: workspaceGid,
    name,
    notes,
  };
  if (projectGid == null) {
    if (sectionGid == null) {
      createParams.assignee = assignee.gid;
    } else {
      throw Error('Internal error - provided section but not project');
    }
  } else if (sectionGid == null) {
    createParams.projects = [projectGid];
  } else {
    createParams.memberships = [{ project: projectGid, section: sectionGid }];
  }
  return createParams;
};

const parseUrl = async (text: string): Promise<{
  parsedText: string,
  projectGid: string | null,
  sectionGid: string | null
}> => {
  const client = await fetchClient();
  const url = new URL(text);
  const sectionGid = url.searchParams.get('section');
  const parsedText = decodeURIComponent(url.pathname);
  let projectGid = null;
  if (sectionGid != null) {
    const section: Asana.resources.Sections.Type = await client.sections.findById(sectionGid);
    if (section.project == null) {
      throw new Error('Project is null!');
    }
    projectGid = section.project.gid;
  }
  return { parsedText, projectGid, sectionGid };
};

export const actOnInputData = async (text: string) => {
  const client = await fetchClient();
  const { parsedText, projectGid, sectionGid } = await parseUrl(text);
  const createParams = await generateTaskCreateParams(parsedText, projectGid, sectionGid);
  const task = await client.tasks.create(createParams);
  const status = `Acting upon ${text}: ${JSON.stringify(task)}`;
  return status;
};
