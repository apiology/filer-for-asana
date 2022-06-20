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
import { targetSections } from './targets.js';

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

export const generateSuggestions = async (userInput: UserInput): Promise<Suggestion[]> => {
  const p = platform();
  const config = p.config();
  const logger = p.logger();
  const workspaceName = await config.fetchWorkspaceName();
  // TODO: using the word 'suggestion' too much
  let projectTargets = null;
  if (userInput.project != null) {
    projectTargets = await pullResult(userInput.project, 'project', []);
  }
  const sectionTargets = await targetSections(projectTargets, userInput.section);
  // 1. add item for each of sectionTargets
  const suggestions = sectionTargets.map(({ project, section }) => {
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
