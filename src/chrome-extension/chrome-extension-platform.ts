import ChromeExtensionCache from './chrome-extension-cache.js';
import ChromeExtensionConfig from './chrome-extension-config.js';
import ChromeExtensionLogger from './chrome-extension-logger.js';

export default class ChromeExtensionPlatform {
  config = () => new ChromeExtensionConfig();

  cache = () => new ChromeExtensionCache();

  logger = () => new ChromeExtensionLogger();
}
