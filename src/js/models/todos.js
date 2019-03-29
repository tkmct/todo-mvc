class Todo {
  constructor({ name }, todos) {
    this.name = name
    this.todos = todos
  }

  save() {
    this.saved = true
    this.todos.push(this)
  }
}

export default class TodoModel {
  constructor() {
    this.todos = []
  }

  all() {
    return this.todos
  }

  new({ name }) {
    const todo = new Todo({ name }, this.todos)
    return todo
  }

  create({ name }) {
    const todo = new Todo({ name }, this.todos)
    todo.save()
    return todo
  }
}
