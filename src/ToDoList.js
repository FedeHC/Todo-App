import { useContext, useState, useRef, useEffect } from "react";
import { TodosContext } from "./App";
import useAPI from "./useAPI";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


function ToDoList() {
  const { state, dispatch } = useContext(TodosContext);

  const [todoText, setTodoText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const addOrEditText = editMode ? "Editar" : "Agregar";
  const buttonStyle = editMode ? "warning" : "info";

  // API GET:
  const endpoint = "http://localhost:3000/todos/";
  const savedTodos = useAPI(endpoint);

  useEffect(() => {
    dispatch({ type: "get", payload: savedTodos });
  }, [savedTodos, dispatch]);

  // console.log("[ToDoList] state:\n", state);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Edit submit:
    if (editMode) {
      // console.log("-editTodo: ", editTodo);
      const editedTodo = { id: editTodo.id, text: todoText };
      await fetch(endpoint+editTodo.id,
        {
          method: 'PUT',
          body: JSON.stringify(editedTodo),
          headers: {
            "Content-Type": "application/json"
          }
        });
      dispatch({ type: 'edit', payload: { ...editTodo, text: todoText } });
      setEditMode(false);
      setEditTodo(null);
    }
    // Add submit:
    else {
      if (todoText !== "") {
        let newId;
        if (state.todos.length > 0)
          newId = state.todos[state.todos.length - 1].id + 1;
        else
          newId = 1;

        const newToDo = { id: newId, text: todoText };
        const addedToDos = [...state.todos, newToDo];

        await fetch(endpoint,
                    {
                      method: 'POST',
                      body: JSON.stringify(newToDo),
                      headers: {
                        "Content-Type": "application/json"
                      }
                    });
        dispatch({ type: "add", payload: addedToDos })
      }
    }
    setTodoText("");
  }
  
  // Edit Callback:
  const editAction = async (todo) => {
    setTodoText(todo.text);
    setEditMode(true);
    setEditTodo(todo);
    inputElement.current.focus();
  }
  
  // Delete Callback:
  const deleteAction = async (todo) => {
    await fetch(endpoint + todo.id, { method: 'DELETE' });
    dispatch({ type: "delete", payload: todo });
  }

  const inputElement = useRef(null);
  
  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm={12} md={8} lg={6}>

          {/* Title Todos */}
          <div className="divHeader">
            <h1 className="header text-center">ToDo App :)</h1>
          </div>

          <div className="divSection">
            {/* FORM */}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={8} md={8} lg={8}>
                  <Form.Control type="text" placeholder={addOrEditText + " tarea acá"}
                    onChange={event => setTodoText(event.target.value)}
                    value={todoText} ref={inputElement} autoFocus />
                </Col>

                {/* ADD */}
                <Col sm={4} md={4} lg={4}>
                  <Button variant={buttonStyle} type="submit">{addOrEditText + '!'}</Button>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Table Todos */}
          <div className="divSection">
            <Table striped borderless hover>
              <thead>
                <tr>
                  <th className="thStyle">Id</th>
                  <th className="thStyle">Tarea</th>
                  <th className="thStyle">Editar</th>
                  <th className="thStyle">Borrar</th>
                </tr>
              </thead>

              <tbody>
                {state.todos && state.todos.map(todo => (
                  <tr key={todo.id}>
                    <td className="firstTd">{todo.id}</td>

                    <td>{todo.text}</td>

                    {/* EDIT */}
                    <td onClick={() => editAction(todo)}>
                      <Button variant="outline-warning" type="button">✏️</Button>
                    </td>

                    {/* DELETE */}
                    <td onClick={() => deleteAction(todo)}>
                      <Button variant="outline-secondary" type="button">🗑</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Footer */}
          <div className="divFooter">
            <h1 className="footer text-center">2021 - Por FedeHC</h1>
          </div>

        </Col>
      </Row>
    </Container >
  );
}

export default ToDoList;
