import Config from '../config.js';
import AlfredConfig from './alfred-config.js';

// needed to create virtual functions implementing an abstract class
// for TypeScript
/* eslint-disable class-methods-use-this */

export default class AlfredCli {
  config(): Config {
    return new AlfredConfig();
  }
}
