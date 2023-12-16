export class ChromeExtensionLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message?: any, ...optionalParams: any[]): void {
    console.log('Filer for Asana', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message?: any, ...optionalParams: any[]): void {
    console.debug('Filer for Asana', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message?: any, ...optionalParams: any[]): void {
    console.warn('Filer for Asana', message, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message?: any, ...optionalParams: any[]): void {
    console.error('Filer for Asana', message, ...optionalParams);
  }

  userVisibleStatus = (message: string): void => {
    chrome.omnibox.setDefaultSuggestion({
      description: `<dim>${message}</dim>`,
    });
  };
}
