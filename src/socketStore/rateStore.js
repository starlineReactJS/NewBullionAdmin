// rateStore.js
class RateStore {
  constructor() {
    this.cache = new Map();
    this.listeners = new Map();
  }

  update(rate) {
    if (!rate?.instrument) return;

    this.cache.set(rate.instrument, rate);

    const subs = this.listeners.get(rate.instrument);
    if (subs) {
      subs.forEach(cb => cb(rate));
    }
  }

  subscribe(instrument, cb) {
    if (!this.listeners.has(instrument)) {
      this.listeners.set(instrument, new Set());
    }

    this.listeners.get(instrument).add(cb);

    // 🔥 IMMEDIATE EMIT FROM CACHE
    const cached = this.getCacheTick(instrument);
    if (cached) {
      cb(cached);
    }

    return () => {
      this.listeners.get(instrument)?.delete(cb);
    };
  }

  getCacheTick(instrument) {
    return this.cache.get(instrument);
  }

  clearCache() {
    this.cache.clear();
  }

}

export const rateStore = new RateStore();