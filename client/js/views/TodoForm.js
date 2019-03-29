import TodoController from '../controllers/TodoController.js'

export default class Form {
  constructor() {
    this.form = document.querySelector('.todo-form')
  }

  mount() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const input = e.target.querySelector('.todo-form__input')
      const name = input.value
      if (name.trim() === '') return false
      input.value = ''
      TodoController.create({ name })
    }, false)
  }
}
