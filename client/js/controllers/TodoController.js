import TodoCollection from '../models/todos.js'
import TodoForm from '../views/TodoForm.js'
import Todo from  '../views/Todo.js'

const TodoController = {
  views: [],

  async create({ name }) {
    const todo = await TodoCollection.create({ name })
    const view = new Todo({ name: todo.name, id: todo.id })
    this.views.push(view)
    view.mount()
  },

  async done({ id, done }) {
    await TodoCollection.update(id, { done })
  },

  async render() {
    const todos = await TodoCollection.read()
    todos.forEach(todo => {
      const view = new Todo({ name: todo.name, id: todo.id, done: todo.done })
      this.views.push(view)
      view.mount()
    })
    new TodoForm('.todo-form').mount()
  },
}

export default TodoController
