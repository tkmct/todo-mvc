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

  async create({ name }) {
    const resp = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ name })
    }).then(res => res.json())
    const model = new TodoModel({ ...resp })
    this.todos.push(model)
    return model
  },
}

export default TodoCollection
