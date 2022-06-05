import { log } from './logger.js';

export const cacheFetch = async (key: string,
  clazz: 'string'): Promise<string | null> => { // TODO: why is this returning string when another type could be requested?
  log(`Fetching config value ${key} of class ${clazz}`);
  return null;
};

export const cacheStore = (key: string, value: string) => {
  log(`Storing config value ${key} with value ${value}`);
  // do nothing for now
};
