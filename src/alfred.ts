import alfy, { ScriptFilterItem } from 'alfy';
// import { pullOmniboxSuggestions } from './filer-for-asana.js';

// https://stackoverflow.com/a/69042224/2625807
function hasOwnProperty<T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// https://stackoverflow.com/questions/68982261/typescript-check-if-a-value-is-string
function isString<T>(data: T): data is T & string {
  return typeof data === 'string';
}

function isNumber<T>(data: T): data is T & number {
  return typeof data === 'number';
}

const validatePost = (data: object): {
  title: string,
  body: string,
  id: number
} => {
  if (hasOwnProperty(data, 'title')
    && hasOwnProperty(data, 'body')
    && hasOwnProperty(data, 'id')) {
    const { title, body, id } = data;

    if (isString(title) && isString(body) && isNumber(id)) {
      return { title, body, id };
    }
  }

  throw new Error(`validation error: ${data}`);
};

const run = async () => {
  const rawData = await alfy.fetch('https://jsonplaceholder.typicode.com/posts');
  if (!(rawData instanceof Array)) {
    throw new Error(`rawData not an array: ${rawData}`);
  }
  const data = rawData.map(validatePost, rawData);

  const items = alfy
    .inputMatches(data, 'title')
    .map((element): ScriptFilterItem => ({
      title: element.title,
      subtitle: element.body,
      arg: String(element.id),
    }));

  alfy.output(items);
};

run();
