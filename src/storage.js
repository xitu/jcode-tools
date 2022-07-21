/* cyrb53 */
function hash(str, seed = 13977641) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const kvHost = 'https://kv.juejin.fun';
export class Storage {
  constructor(bucket = hash(location.href)) {
    this.bucket = bucket;
  }

  async get(key) {
    const res = await fetch(`${kvHost}/doc/${key}`, {
      method: 'GET',
      headers: {
        'X-Project-Id': this.bucket,
      },
    });
    const ret = await res.json();
    this.result = ret;
    if(ret.error) {
      return null;
    }
    return ret.result;
  }

  async set(key, value) {
    const res = await fetch(`${kvHost}/doc/append/${key}`, {
      method: 'POST',
      headers: {
        'X-Project-Id': this.bucket,
      },
      body: JSON.stringify(value),
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }

  async del(key) {
    const res = await fetch(`${kvHost}/doc/${key}`, {
      method: 'DELETE',
      headers: {
        'X-Project-Id': this.bucket,
      },
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }
}