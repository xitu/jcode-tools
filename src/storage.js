const kvHost = 'https://55aus9vavw.hk.aircode.run/storage';
export class Storage {
  constructor(bucket = location.href) {
    this.bucket = bucket;
  }

  async get(key) {
    const res = await fetch(`${kvHost}?key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Bucket-Id': this.bucket,
      },
    });
    const ret = await res.json();
    this.result = ret;
    if(ret.error) {
      return null;
    }
    return ret.result.value;
  }

  async set(key, value) {
    const res = await fetch(kvHost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bucket-Id': this.bucket,
      },
      body: JSON.stringify({key, value}),
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }

  async del(key) {
    const res = await fetch(kvHost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bucket-Id': this.bucket,
      },
      body: JSON.stringify({key}),
    });
    const ret = await res.json();
    this.result = ret;
    return !ret.error;
  }
}