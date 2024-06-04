export class IdGenerator {
  #currentId = 0;
  next() {
    this.#currentId += 1;
  }
  get() {
    return this.#currentId;
  }
}
