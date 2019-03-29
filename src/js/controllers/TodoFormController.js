import TodoModel from '../models/todos'

const model = new TodoModel()

const TodoFormController = {
  submit({ name }) {
    model.create({ name })
  },
}

export default TodoFormController
