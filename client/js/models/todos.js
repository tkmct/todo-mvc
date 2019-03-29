class TodoModel {
  constructor({ id, name, done }) {
    this.id = id
    this.name = name
    this.done = done
  }

  update({ name, done }) {
    if (name) this.name = name
    if (typeof done !== 'undefined') this.done = done
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

  async update(id, { done }) {
    const todo = this.todos.find(t => t.id === parseInt(id, 10))
    const resp = await fetch(`/todos/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ name: todo.name, done }),
    }).then(res => res.json())
    const model = this.todos.find(todo => todo.id === resp.id)
    if (model) model.update({ name, done })
  },
}

export default TodoCollection
