/**
 * filer-for-asana module.
 *
 * Chrome extension which quickly creates Asana tasks from the Chrome Omnibox.
 */

import { escapeHTML } from './omnibox.js';
import { fetchWorkspaceName } from './config.js';
import { fetchClient, fetchWorkspaceGid } from './asana-base.js';

export const logSuccess = (result: string | object): void => console.log('Upvoted task:', result);

export const pullOmniboxSuggestions = async (text: string) => {
  const workspaceName = await fetchWorkspaceName();
  console.log(`Got text as [${text}]`);
  const content = `filer-for-asana:${encodeURIComponent(text)}`;
  return [
    {
      content,
      description: escapeHTML(`File ${text} in workspace ${workspaceName}`),
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
