export default class TodoDoneCounter {
  constructor() {
    this.counter = document.querySelector('.done-items-num__value')
  }

  update(count) {
    this.counter.innerText = count
  }
}
