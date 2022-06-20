import { prioritizedMatchedSectionTargets } from './targets.js';

test('prioritizedMatchedSectionTargets', () => {
  expect(prioritizedMatchedSectionTargets([
    { name: 'abc' },
  ], 'a').map((s) => s.name))
    .toEqual(['abc']);

  expect(prioritizedMatchedSectionTargets([
    { name: 'abc' },
    { name: 'def' },
  ], 'a').map((s) => s.name))
    .toEqual(['abc']);

  expect(prioritizedMatchedSectionTargets([
    { name: 'abc' },
    { name: 'def' },
  ], 'A').map((s) => s.name))
    .toEqual(['abc']);
});
