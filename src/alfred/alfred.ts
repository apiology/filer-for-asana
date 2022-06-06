import alfy, { ScriptFilterItem } from 'alfy';
import { pullSuggestions } from '../filer-for-asana.js';
import { isString } from '../types.js';

const run = async () => {
  let items: ScriptFilterItem[];
  try {
    const suggestions = await pullSuggestions(alfy.input);
    items = suggestions.map((suggestion): ScriptFilterItem => ({
      title: suggestion.description,
      subtitle: 'Filer for Asana',
      arg: suggestion.url,
    }));
    alfy.output(items);
  } catch (error) {
    if (error instanceof Error || isString(error)) {
      alfy.error(error);
    } else {
      throw error;
    }
  }
};

run();
