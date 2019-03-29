import TodoCollection from '../models/todos.js'
import Todo from  '../views/Todo.js'

const TodoController = {
  // 今描画している View 一覧
  views: [],

  async render() {
    const todos = await TodoCollection.read()
    todos.forEach(todo => {
      const view = new Todo({ name: todo.name, id: todo.id, done: todo.done })
      this.views.push(view)
      view.mount()
    })
  },
}

export default TodoController
