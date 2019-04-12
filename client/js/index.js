const API_ROOT = 'http://localhost:3000'


function h(tagName, attributes, children) {
  const dom = document.createElement(tagName)
  Object.keys(attributes).forEach(k => {
    if (k === 'onClick') {
      dom.addEventListener('click', attributes[k])
    } else if (k === 'onChange') {
      dom.addEventListener('change', attributes[k])
    } else {
      dom.setAttribute(k, attributes[k])
    }
  })

  if (children instanceof Array) {
    children.forEach(child => {
      dom.appendChild(child)
    })
  } else if (children) {
    dom.appendChild(children)
  }

  return dom
}

function t(str) {
  return document.createTextNode(str)
}


// TODO FORM
class FormView {
  constructor(root, onSubmit) {
    this.root = root
    this.onSubmit = onSubmit
  }

  createDOM() {
    return h('form', {
      'class': 'todo-form'
    },
    [
      h('label', { for: 'name', 'class': 'todo-form__label' }, t('TODO')),
      h('div', {
        'class': 'todo-form-input__wrapper'
      },
        [h('input', {
          id: 'name',
          'class': 'todo-form__input',
          name: 'name',
          type: 'text'
        }),
        h('input', {
          'class': 'todo-form__submit',
          type: 'submit',
          value: 'Submit'
        })
      ])
    ])
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
  constructor(root, onUpdate, onDelete) {
    this.root = root
    this.onUpdate = onUpdate
    this.onDelete = onDelete
  }

  createTodoItem(todo, { onUpdate, onDelete }) {
    const checkAttrs = {
      type: 'checkbox',
      'class': 'todo-toggle',
      onChange: function(e) {
        onUpdate({ ...todo, done: this.checked })
      }
    }
    if (todo.done) {
      checkAttrs.checked = true
    }

    return h('li', { 'class': 'todo-item' }, [
      h('label', { 'class': 'todo-toggle__container' }, [
        h('input', checkAttrs),
        h('span', { 'class': 'todo-toggle__checkmark' })
      ]),
      h('div', { 'class': 'todo-name' }, t(todo.name)),
      h('div', {
        'class': 'todo-remove-button',
        onClick: (e) => { onDelete(todo.id )}
      }, t('x'))
    ])
  }

  createTodoList(todos) {
    const ul =  document.createElement('ul')
    ul.setAttribute('class', 'todos')
    todos.forEach(todo => ul.appendChild(this.createTodoItem(todo, { onUpdate: this.onUpdate, onDelete: this.onDelete })))
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

  static updateTodo(todo) {
    return fetch(`${API_ROOT}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo)})
      .then(res => res.json())
  }

  static deleteTodo(id) {
    return fetch(`${API_ROOT}/todos/${id}`, { method: 'DELETE' })
      .then(res => res.json())
  }
}

class TodoController {
  constructor(root) {
    this.todos = []
    this.initialMount = true
    this.view = new TodoView(root, this.updateTodo, this.deleteTodo)
  }

   addTodo = async ({ name }) => {
    const params = { name, done: false }
    const res = await TodoModel.addTodo(params)
    const todo = new TodoModel(res)
    
    this.todos.push(todo)
    this.render()
  }

  updateTodo = async (todo) => {
    await TodoModel.updateTodo(todo)
  }

  deleteTodo = async (value) => {
    await TodoModel.deleteTodo(value)
    const i = this.todos.findIndex((todo) => todo.id === value)
    this.todos.splice(i, 1)
    this.view.render(this.todos)
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