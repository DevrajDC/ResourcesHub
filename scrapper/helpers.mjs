export function isEmpty(obj) {
  const keys = Object.keys(obj);

  if (keys.length === 0) return true;

  if (keys.every((k) => obj[k])) {
    return false;
  }
}

export function filterEmpty(objs) {
  return objs.reduce((result, obj) => {
    if (isEmpty(obj)) return result;

    result.push(obj);

    return result;
  }, []);
}

