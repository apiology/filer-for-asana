import { prioritizedMatchedSectionTargets } from './targets.js';

test('firstTest', () => {
  expect(prioritizedMatchedSectionTargets([
    { name: 'abc' },
  ], 'a').map((s) => s.name))
    .toEqual(['abc']);
});
