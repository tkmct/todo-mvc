import TodoForm from './views/Form'

const main = () => {
  new TodoForm('.todo-form').register()
}

document.addEventListener('DOMContentLoaded', main)
