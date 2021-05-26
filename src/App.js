import React, { useReducer } from 'react';
import ToDoList from './ToDoList'


const todosInitialState = {
  todos: []
};

export const TodosContext = React.createContext();

function todosReducer(state, action) {
  switch (action.type) {
    case 'get':
      return { ...state,todos:action.payload };

    case 'add':
      let newId;
      if (state.todos.length > 0)
        newId = state.todos[state.todos.length-1].id + 1;
      else
        newId = 1;

      const newToDo = { id: newId, text: action.payload };
      const addedToDos = [...state.todos, newToDo];
      return { ...state, todos: addedToDos };

    case 'delete':
      const filteredTodoState = state.todos.filter(todo => todo.id !== action.payload.id);
      return { ...state, todos: filteredTodoState };

    case 'edit':
      const updatedToDo = { ...action.payload };
      const updatedToDoIndex = state.todos.findIndex(t => t.id === action.payload.id);
      const updatedToDos = [
        ...state.todos.slice(0, updatedToDoIndex),
        updatedToDo,
        ...state.todos.slice(updatedToDoIndex + 1)
      ];
      return { ...state, todos: updatedToDos };

    default:
      return todosInitialState;
  }
}

function App() {
  const [state, dispatch] = useReducer(todosReducer, todosInitialState);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      <ToDoList />
    </TodosContext.Provider>
  );
}

export default App;
