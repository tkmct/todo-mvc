import TodoCollection from '../models/todos.js'
import TodoDoneCounter from '../views/TodoDoneCounter.js'
import TodoForm from '../views/TodoForm.js'
import Todo from  '../views/Todo.js'

const counter = new TodoDoneCounter()

const TodoController = {
  views: [],

  async create({ name }) {
    const todo = await TodoCollection.create({ name })
    const view = new Todo({ name: todo.name, id: todo.id })
    this.views.push(view)
    view.mount()
    this.count()
  },

  async done({ id, done }) {
    await TodoCollection.update(id, { done })
    this.count()
  },

  async remove(id) {
    await TodoCollection.remove(id)
    this.unmount(id)
    this.count()
  },

  async render() {
    const todos = await TodoCollection.read()
    todos.forEach(todo => {
      const view = new Todo({ name: todo.name, id: todo.id, done: todo.done })
      this.views.push(view)
      view.mount()
    })
    new TodoForm('.todo-form').mount()
    this.count()
  },

  unmount(id) {
    const view = this.views.find(v => v.id === parseInt(id, 10))
    if (view) view.unmount()
    this.views = this.views.filter(v => !(v.id === parseInt(id, 10)))
  },

  count() {
    const count = TodoCollection.readFromLocal().filter(todo => todo.done).length
    counter.update(count)
  },
}

export default TodoController
