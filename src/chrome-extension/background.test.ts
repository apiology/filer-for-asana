import { chrome } from 'jest-chrome';
import { doWork } from '../filer-for-asana.js';
import { setPlatform } from '../platform.js';
import { TestPlatform } from '../__mocks__/test-platform.js';
import { registerEventListeners } from './background.js';

jest.mock('../filer-for-asana');

test('registerEventListeners', async () => {
  jest.mocked(doWork);

  setPlatform(new TestPlatform());

  registerEventListeners();

  chrome.browserAction.onClicked.callListeners({} as never);

  expect(doWork).toHaveBeenCalled();
});
