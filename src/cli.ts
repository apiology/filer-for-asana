import Cache from './cache.js';
import Config from './config.js';
import Logger from './logger.js';

export abstract class Cli {
  abstract config(): Config;

  abstract cache(): Cache;

  abstract logger(): Logger;
}

let theCli: Cli | null = null;

export const cli = (): Cli => {
  if (theCli == null) {
    throw Error('Please call setCli() before use');
  }
  return theCli;
};

export const setCli = (newCli: Cli) => {
  theCli = newCli;
};
