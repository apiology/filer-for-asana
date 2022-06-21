import * as Asana from 'asana';

export default abstract class Formatter {
  abstract formatTask(task: Asana.resources.Tasks.Type): string;

  abstract escapeDescriptionPlainText(text: string): string;

  abstract formatDescriptionJustWorkspace(
    text: string,
    workspaceName: string
  ): string;

  abstract formatDescriptionWithSection(
    text: string,
    workspaceName: string,
    projectName: string,
    sectionName: string
  ): string;
}
