class Stream {
  bufferSize = 10;
  buffers = [];
  subscribers = [];
  value = null;
  next(value) {
    // this.buffers.push(value);
    this.value = value;
    this.subscribers.map(sub => sub(value, this));
  }
  subscribe(handler) {
    this.subscribers.push(handler);
    return () => {
      const index = this.subscribers.indexOf(handler);
      this.subscribers.splice(index, 1);
    };
  }
  get() {
    return this.value;
  }

  set = this.next;
}

const streams = {};

export const getStream = (name) => {
  streams[name] = streams[name] || new Stream();
  return streams[name];
};
