/**
 * filer-for-asana module.
 *
 * Chrome extension which quickly creates Asana tasks from the Chrome Omnibox and Alfred.
 */

import { platform } from './platform.js';
import { fetchClient, fetchWorkspaceGid } from './asana-base.js';

export const logSuccess = (result: string | object): void => {
  const logger = platform().logger();
  logger.log('Upvoted task:', result);
};

export type Suggestion = {
  url: string
  text: string;
  description: string;
}

export const pullSuggestions = async (text: string): Promise<Suggestion[]> => {
  const p = platform();
  const logger = p.logger();
  const config = p.config();
  logger.log(`Got text as [${text}]`);
  const workspaceName = await config.fetchWorkspaceName();
  const description = `File "${text}" in workspace ${workspaceName}`;
  const url = `filer-for-asana:${encodeURIComponent(text)}`;
  return [
    {
      url,
      text,
      description,
    },
  ];
};

export const actOnInputData = async (text: string) => {
  const client = await fetchClient();
  const workspaceGid = await fetchWorkspaceGid();
  const assignee = await client.users.me();

  let parsedText = text;
  if (text.startsWith('filer-for-asana:')) {
    const url = new URL(text);
    parsedText = decodeURIComponent(url.pathname);
  }

  const out = await client.tasks.create({
    workspace: workspaceGid,
    assignee: assignee.gid,
    name: parsedText,
  });
  const status = `Acting upon ${text}: ${JSON.stringify(out)}`;
  return status;
};
