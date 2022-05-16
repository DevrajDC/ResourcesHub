import path from 'path';
import { URL } from 'url';

export function isEmpty(obj) {
  const keys = Object.keys(obj);

  if (keys.length === 0) return true;

  if (keys.every((k) => obj[k])) {
    return false;
  }
}

export function hasSufficientMeta(obj) {
  const required = ['title', 'description', '_id', 'image', 'url'];
  const properties = Object.getOwnPropertyNames(obj);
  return required.every((e) => properties.includes(e));
}

export function filterEmpty(objs) {
  return objs.reduce((result, obj) => {
    if (isEmpty(obj)) return result;

    result.push(obj);

    return result;
  }, []);
}

export function sanitizeFilename(name) {
  return name.toLowerCase().trim().replace(' ', '-');
}

export function toAbsolutePath(url, base) {
  const exp = new RegExp('^(?:[a-z]+:)?//', 'i');

  // return the original url if the given url is not relative
  if (exp.test(url)) return url;

  const _url = new URL(url, base);

  return _url.href;
}
