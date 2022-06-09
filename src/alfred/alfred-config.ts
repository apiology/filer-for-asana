import { isString } from '../types.js';

/* eslint-disable @typescript-eslint/no-unused-vars */
const fetchConfigString = (envVarName: string) => {
  const value = process.env[envVarName];
  if (value == null || !isString(value)) {
    throw Error(`Configure ${envVarName} in Alfred env vars`);
  }
  return value;
};
/* eslint-enable @typescript-eslint/no-unused-vars */

export default class AlfredConfig {
  fetchAsanaAccessToken = async () => fetchConfigString('asana_access_key');

  fetchWorkspaceName = async (): Promise<string> => fetchConfigString('workspace_name');
}
