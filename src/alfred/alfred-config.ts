import { isString } from '../types.js';

const fetchConfigString = (envVarName: string) => {
  const value = process.env[envVarName];
  if (value == null || !isString(value)) {
    throw Error(`Configure ${envVarName} in Alfred env vars`);
  }
  return value;
};

export default class AlfredConfig {
  fetchAsanaAccessToken = async () => fetchConfigString('asana_access_key');

  fetchWorkspaceName = async (): Promise<string> => fetchConfigString('workspace_name');
}
