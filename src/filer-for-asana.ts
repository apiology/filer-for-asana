/**
 * filer-for-asana module.
 *
 * Quickly creates Asana tasks from the Chrome Omnibox and Alfred workflows.
 */

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
  const url = `filer-for-asana:${encodeURIComponent(text)}`;
  const description = `Do some random action on "${text}"`;
  return [
    {
      url,
      text,
      description,
    },
  ];
};

export const actOnInputData = async (text: string) => {
  const url = new URL(text);
  const parsedText = decodeURIComponent(url.pathname);
  console.log(`Acting upon ${parsedText}`);
  return 'a success message or status';
};
