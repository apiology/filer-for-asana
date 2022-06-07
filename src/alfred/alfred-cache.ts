import AlfredLogger from './alfred-logger.js';

export default class AlfredCache {
  cacheFetch = async (key: string,
    clazz: 'string'): Promise<string | null> => { // TODO: why is this returning string when another type could be requested?
    const logger = new AlfredLogger();
    logger.log(`Fetching config value ${key} of class ${clazz}`);
    return null;
  };

  cacheStore = async (key: string, value: string): Promise<void> => {
    const logger = new AlfredLogger();
    logger.log(`Storing config value ${key} with value ${value}`);
    // do nothing for now // TODO: implement
  };
}
