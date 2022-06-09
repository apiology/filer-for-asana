export default class AlfredLogger {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  log = (message?: any, ...optionalParams: any[]) => {
    // prefer stderr on node, as logging messages shouldn't go to stdout
    // where functional output (e.g. JSON) might be going
    // console.error(message, ...optionalParams);
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  /* eslint-enable @typescript-eslint/no-unused-vars */

  debug = (s: string): void => {
    console.debug(s);
  };
}
