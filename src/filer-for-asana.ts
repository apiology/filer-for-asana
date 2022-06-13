/**
 * filer-for-asana module.
 *
 * Quickly creates Asana tasks from the Chrome Omnibox and Alfred workflows.
 */

import { fetchClient, fetchWorkspaceGid } from './asana-base.js';
import { platform } from './platform.js';

export const logSuccess = (result: string | object): void => {
  const logger = platform().logger();
  logger.log('Acted:', result);
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
  const url = new URL(text);
  const parsedText = decodeURIComponent(url.pathname);
  const out = await client.tasks.create({
    workspace: workspaceGid,
    assignee: assignee.gid,
    name: parsedText,
  });
  const status = `Acting upon ${text}: ${JSON.stringify(out)}`;
  return status;
};
