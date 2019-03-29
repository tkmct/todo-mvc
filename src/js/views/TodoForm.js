import TodoFormController from '../controllers/TodoFormController'

export default class Form {
  constructor(selector) {
    this.form = document.querySelector(selector)
    this.controllers = TodoFormController
  }

  register() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      const name = e.target.value
      this.controllers.submit({ name })
    }, false)
  }
}
