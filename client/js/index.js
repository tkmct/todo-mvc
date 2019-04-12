const API_ROOT = 'http://localhost:3000'


// TODO FORM
class FormView {
  constructor(root, onSubmit) {
    this.root = root
    this.onSubmit = onSubmit
  }

  createDOM() {
    const form = document.createElement('form')
    form.setAttribute('class', 'todo-form')

    const label = document.createElement('label')
    label.setAttribute('for', 'name')
    label.setAttribute('class', 'todo-form__label')
    label.innerHTML = 'TODO'
    form.appendChild(label)

    const inputWrapper = document.createElement('div')
    inputWrapper.setAttribute('class', 'todo-form-input__wrapper')

    const inputName = document.createElement('input')
    inputName.setAttribute('id', 'name')
    inputName.setAttribute('class', 'todo-form__input')
    inputName.setAttribute('name', 'name')
    inputName.setAttribute('type', 'text')
    inputWrapper.appendChild(inputName)

    const inputSubmit = document.createElement('input')
    inputSubmit.setAttribute('class', 'todo-form__submit')
    inputSubmit.setAttribute('type', 'submit')
    inputSubmit.setAttribute('value', 'Submit')
    inputWrapper.appendChild(inputSubmit)

    form.appendChild(inputWrapper)
    return form
  }

  render() {
    const form = this.createDOM()
    form.addEventListener('submit', (e) => { 
      e.preventDefault()
      const name = document.getElementById('name')
      this.onSubmit({ name: name.value })
      name.value = ''
    })
    this.root.appendChild(form)
  }
}

class FormController {
  constructor(root, onSubmit) {
    this.root = root
    this.view = new FormView(root, onSubmit)
  }

  render() {
    this.view.render()
  }
}


// TODO LIST
class TodoView {
  constructor(root) {
    this.root = root
  }

  createTodoItem(todo) {
    const li = document.createElement('li')
    li.setAttribute('class', 'todo-item')

    // create label
    const label = document.createElement('label')
    label.setAttribute('class', 'todo-toggle__container')

    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.setAttribute('class', 'todo-toggle')
    input.setAttribute('value', 'checked')
    label.appendChild(input)

    const checkmark = document.createElement('span')
    checkmark.setAttribute('class', 'todo-toggle__checkmark')
    label.appendChild(checkmark)

    li.appendChild(label)

    // create name
    const name = document.createElement('div')
    name.setAttribute('class', 'todo-name')
    name.innerHTML = todo.name
    li.appendChild(name)

    // create remove button
    const removeButton = document.createElement('div')
    removeButton.setAttribute('class', 'todo-remove-button')
    removeButton.innerHTML = 'x'


    // TODO: addEventListener
    li.appendChild(removeButton)

    return li
  }

  createTodoList(todos) {
    const ul =  document.createElement('ul')
    ul.setAttribute('class', 'todos')
    todos.forEach(todo => ul.appendChild(this.createTodoItem(todo)))
    return ul
  }

  render(models) {
    const { root } = this
    const todoListDOM = this.createTodoList(models)

    // clean root children
    while (root.firstChild) {
      root.removeChild(root.firstChild)
    }

    root.appendChild(todoListDOM)
  }
}

// Todo model
class TodoModel {
  constructor({ id, name, done }) {
    this.id = id
    this.name = name
    this.done = done
  }

  static getAll() {
    return fetch(`${API_ROOT}/todos`)
      .then(res => res.json())
      .then(items => items.map(item => new TodoModel(item)))
  }

  static addTodo(todo) {
    return fetch(`${API_ROOT}/todos`, {
      method: 'POST',
      headers: { 
      "Content-Type": "application/json",

     },
     body: JSON.stringify(todo)})
      .then(res => res.json())
  }
}

class TodoController {
  constructor(root) {
    this.view = new TodoView(root)
    this.todos = []
    this.initialMount = true
  }

   addTodo = async ({ name }) => {
    const params = { name, done: false }
    const res = await TodoModel.addTodo(params)
    const todo = new TodoModel(res)
    
    this.todos.push(todo)
    this.render()
  }

  async render() {
    if (this.initialMount) {
      this.todos = await TodoModel.getAll()
      this.initialMount = false
    }

     this.view.render(this.todos)
  }
}

async function main() {
  const root = document.getElementById('todo-list-root')
  const todoController = new TodoController(root)
  await todoController.render()

  const formRoot = document.getElementById('todo-form-root')
  const formController = new FormController(formRoot, todoController.addTodo)
  formController.render()
}

main()