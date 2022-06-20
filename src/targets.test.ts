import { prioritizedMatchedSectionTargets } from './targets.js';

describe('prioritizedMatchedSectionTargets', () => {
  it('selects down using case-insensitive substrings', () => {
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

  it('finds the most relevant matches', () => {
    expect(prioritizedMatchedSectionTargets([
      { name: 'ultra high [3]' },
      { name: 'really high [3]' },
      { name: 'high [5]' },
    ], 'high')[0].name)
      .toEqual('high [5]');
  });
});
