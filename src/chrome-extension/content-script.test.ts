/**
 * @jest-environment jsdom
 */

// import { someTriggerFunction } from '../filer-for-asana.js';
import { registerEventListeners } from './content-script.js';
import { setPlatform } from '../platform.js';
import { TestPlatform } from '../__mocks__/test-platform.js';

jest.mock('../filer-for-asana');

test('registerEventListeners', async () => {
  // jest.mocked(shortcutsKeyDownBeforeOthers);

  setPlatform(new TestPlatform());

  registerEventListeners();

  // document.dispatchEvent(new window.KeyboardEvent('keydown'));

  // expect(someTriggerFunction).toHaveBeenCalled();
});
