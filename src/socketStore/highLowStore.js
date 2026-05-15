class HighLowStore {
  constructor() {
    this.map = new Map();        
    this.listeners = new Map();  
  }

  update(list) {
    list.forEach(item => {
      this.map.set(item.uId, { high: item.high, low: item.low });

      if (this.listeners.has(item.uId)) {
        this.listeners.get(item.uId).forEach(cb =>
          cb({ high: item.high, low: item.low })
        );
      }
    });
  }

  subscribe(uid, cb) {
    if (!this.listeners.has(uid)) {
      this.listeners.set(uid, new Set());
    }
    this.listeners.get(uid).add(cb);

    // send last value immediately if exists
    if (this.map.has(uid)) {
      cb(this.map.get(uid));
    }

    return () => {
      this.listeners.get(uid)?.delete(cb);
    };
  }

  clear() {
    this.map.clear();
  }

}

export const highLowStore = new HighLowStore();
