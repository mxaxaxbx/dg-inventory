const camelToSnake = (obj: any): any => {
  // Return unchanged if not an object or is null
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Handle arrays specially
  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item));
  }

  // Handle regular objects
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const value = obj[key];

    // Recursively convert nested objects or arrays
    newObj[newKey] = camelToSnake(value);
  });

  return newObj;
};

const snakeToCamel = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // return unchanged if obj is not an object or is null
  }

  // if obj is an array, recursively convert each element
  if (Array.isArray(obj)) {
    return obj.map((v: any) => snakeToCamel(v));
  }

  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    // if the value is an object, recursively convert it
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      newObj[newKey] = snakeToCamel(obj[key]);
      return;
    }
    newObj[newKey] = obj[key];
  });
  return newObj;
};

export {
  camelToSnake,
  snakeToCamel,
};
