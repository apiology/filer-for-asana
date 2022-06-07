import { log } from './logger.js';

export default class AlfredCache {
  cacheFetch = async (key: string,
    clazz: 'string'): Promise<string | null> => { // TODO: why is this returning string when another type could be requested?
    log(`Fetching config value ${key} of class ${clazz}`);
    return null;
  };

  cacheStore = async (key: string, value: string): Promise<void> => {
    log(`Storing config value ${key} with value ${value}`);
    // do nothing for now // TODO: implement
  };
}
