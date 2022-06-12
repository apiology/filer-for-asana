/**
 * omnibox module.
 *
 * Contains functions useful to interact with chrome.omnibox API
 */

import * as _ from 'lodash';
import {
  pullSuggestions, Suggestion, actOnInputData, logSuccess,
} from '../filer-for-asana.js';

const pullOmniboxSuggestions = async (text: string) => {
  const suggestions = await pullSuggestions(text);
  return suggestions.map((suggestion: Suggestion) => ({
    content: suggestion.url,
    description: suggestion.description,
  }));
};

type SuggestFunction = (suggestResults: chrome.omnibox.SuggestResult[]) => void;

const populateOmnibox = async (text: string, suggest: SuggestFunction) => {
  const suggestions = await pullOmniboxSuggestions(text);
  if (suggestions.length === 1) {
    chrome.omnibox.setDefaultSuggestion({ description: suggestions[0].description });
  } else {
    suggest(suggestions);
    console.log(`${suggestions.length} suggestions from ${text}:`, suggestions);
    const description = `<dim>${suggestions.length} results for ${text}:</dim>`;
    chrome.omnibox.setDefaultSuggestion({ description });
  }
};

const pullAndReportSuggestions = async (text: string, suggest: SuggestFunction) => {
  try {
    await populateOmnibox(text, suggest);
  } catch (err) {
    alert(`Problem getting suggestions for ${text}: ${err}`);
    throw err;
  }
};

const pullAndReportSuggestionsDebounced = _.debounce(pullAndReportSuggestions,
  500);

export const omniboxInputChangedListener = (text: string, suggest: SuggestFunction) => {
  chrome.omnibox.setDefaultSuggestion({
    description: `<dim>Waiting for results from ${text}...</dim>`,
  });
  return pullAndReportSuggestionsDebounced(text, suggest);
};

export const omniboxInputEnteredListener = async (inputData: string) => {
  try {
    const out = await actOnInputData(inputData);
    logSuccess(out);
  } catch (err) {
    alert(`Failed to process ${inputData}: ${err}`);
    throw err;
  }
};
