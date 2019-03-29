class TodoModel {
  constructor({ id, name, done }) {
    this.id = id
    this.name = name
    this.done = done
  }
}

const TodoCollection = {
  todos: [],

  async read() {
    const { todos } = await fetch('/todos').then(res => res.json())
    this.todos = todos.map(t => new TodoModel({ ...t }))
    return this.todos
  },
}

export default TodoCollection
