class Flow {
  constructor(workers) {
    this.workers = workers;
    this.context = {};
    // bind worker to context
    this.workers.map(worker => {
      const bindings = worker.bindings();
      bindings.map(key => this.context.bind(key, worker));
    });
  }

  process(data) {
    this.context.load(data);
  }
}