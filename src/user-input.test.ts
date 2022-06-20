import { parseUserInput } from './user-input.js';

test('parseUserInput', () => {
  expect(parseUserInput('foo')).toEqual({
    project: null,
    raw: 'foo',
    remaining: 'foo',
    section: null,
  });

  expect(parseUserInput('#bar')).toEqual({
    project: 'bar',
    raw: '#bar',
    remaining: '',
    section: null,
  });

  expect(parseUserInput('.baz')).toEqual({
    project: null,
    raw: '.baz',
    remaining: '',
    section: 'baz',
  });

  expect(parseUserInput('foo #bar')).toEqual({
    project: 'bar',
    raw: 'foo #bar',
    remaining: 'foo',
    section: null,
  });

  expect(parseUserInput('foo #bar .baz')).toEqual({
    project: 'bar',
    raw: 'foo #bar .baz',
    remaining: 'foo',
    section: 'baz',
  });

  expect(parseUserInput('foo #urgent .high')).toEqual({
    project: 'urgent',
    raw: 'foo #urgent .high',
    remaining: 'foo',
    section: 'high',
  });

  expect(parseUserInput('foo #3 #bar .baz')).toEqual({
    project: 'bar',
    raw: 'foo #3 #bar .baz',
    remaining: 'foo #3',
    section: 'baz',
  });

  expect(parseUserInput('foo. bar. #3 #baz .bing')).toEqual({
    project: 'baz',
    raw: 'foo. bar. #3 #baz .bing',
    remaining: 'foo. bar. #3',
    section: 'bing',
  });

  expect(parseUserInput('foo .bar')).toEqual({
    project: null,
    raw: 'foo .bar',
    remaining: 'foo',
    section: 'bar',
  });

  expect(parseUserInput('Grove Co plastic free - grove.com #things-to-buy')).toEqual({
    project: 'things-to-buy',
    raw: 'Grove Co plastic free - grove.com #things-to-buy',
    remaining: 'Grove Co plastic free - grove.com',
    section: null,
  });
});
