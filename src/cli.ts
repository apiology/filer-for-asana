import Cache from './cache.js';
import Config from './config.js';

export abstract class Cli {
  abstract config(): Config;

  abstract cache(): Cache;
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
