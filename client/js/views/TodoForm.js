import TodoController from '../controllers/TodoController.js'

export default class Form {
  constructor(selector) {
    this.form = document.querySelector(selector)
    this.controller = TodoController
  }

  mount() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const input = e.target.querySelector('.todo-form__input')
      const name = input.value
      if (name.trim() === '') return false
      input.value = ''
      this.controller.create({ name })
    }, false)
  }
}
