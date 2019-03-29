import TodoController from '../controllers/TodoController.js'

const sanitaize = (str) => (
  (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
)

export default class Todo {
  constructor({ name, id, done })  {
    this.parent = document.querySelector('.todos')
    this.name = name
    this.element = document.createElement('li')
    this.element.className = 'todo-item'
    this.element.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done && 'checked' }>
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${sanitaize(name)}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `
  }

  mount() {
    const done = (e) => {
      const id = e.target.getAttribute('data-todo-id')
      const done = e.target.checked
      TodoController.done({ id, done })
    }
    this.element.querySelector('.todo-toggle').addEventListener('change', done)
    this.parent.appendChild(this.element)

    this.removeListener = () => {
      this.element.querySelector('.todo-toggle').removeEventListener('change', done)
    }
  }
}
