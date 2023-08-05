export abstract class Config {
  abstract fetchAsanaAccessToken(): Promise<string>;

  abstract fetchWorkspaceName(): Promise<string>;

  validate = async (): Promise<void> => {
    await this.fetchAsanaAccessToken();
    await this.fetchWorkspaceName();
  };
}
