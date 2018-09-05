import _ from 'lodash';
class Stream {
  bufferSize = 10;
  buffers = [];
  subscribers = [];
  value = null;
  constructor(opts) {
    this.value = _.get(opts, 'init', null);
    this.bufferSize = _.get(opts, 'bufferSize', 10);
    this.buffers.unshift(this.value);
  }
  next(value) {
    // this.buffers.push(value);
    this.value = value;
    this.buffers.unshift(value);
    if (this.buffers.length > this.bufferSize) {
      this.buffers.splice(this.bufferSize, 1);
    }

    this.subscribers.map(sub => sub(value, this));
  }
  subscribe(handler) {
    this.subscribers.push(handler);
    return () => {
      const index = this.subscribers.indexOf(handler);
      this.subscribers.splice(index, 1);
    };
  }
  get(index=0) {
    return this.buffers[index];
  }

  set = this.next;
}

const streams = {};

export const getStream = (name, opts) => {
  streams[name] = streams[name] || new Stream(opts);
  return streams[name];
};
