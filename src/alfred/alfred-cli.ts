import AlfredCache from './alfred-cache.js';
import AlfredConfig from './alfred-config.js';
import AlfredLogger from './alfred-logger.js';

// needed to create virtual functions implementing an abstract class
// for TypeScript
/* eslint-disable class-methods-use-this */

export default class AlfredCli {
  config() {
    return new AlfredConfig();
  }

  cache() {
    return new AlfredCache();
  }

  logger() {
    return new AlfredLogger();
  }
}
