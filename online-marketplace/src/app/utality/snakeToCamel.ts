export function snakeToCamel(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => snakeToCamel(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        acc[camelKey] = snakeToCamel(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }

  export function camelToSnake(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => camelToSnake(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        acc[snakeKey] = camelToSnake(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }
  
  