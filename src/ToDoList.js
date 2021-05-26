import React, { useContext, useState, useRef, useEffect } from "react";
import { TodosContext } from "./App";
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

  const buttonTitle = editMode ? "Edit task" : "Add task";
  const buttonStyle = editMode ? "warning" : "info";

  const handleSubmit = event => {
    event.preventDefault();

    if (editMode) {
      dispatch({ type: 'edit', payload:{ ...editTodo, text:todoText } });
      setEditMode(false);
      setEditTodo(null);
    }
    else {
      if (todoText !== "") {
        dispatch({ type: "add", payload: todoText })
      }
    }
    setTodoText("");
  }

  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      inputElement.current.select();
    }
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm={12} md={8} lg={6}>

          {/* Title Todos */}
          <div className="divHeader">
            <h1 className="header text-center">ToDo App :)</h1>
          </div>

          {/* ADD Todo */}
          <div className="divSection">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={8} md={8} lg={8}>
                  <Form.Control type="text" placeholder="Enter todo task here"
                    onChange={event => setTodoText(event.target.value)}
                    value={todoText} ref={inputElement} />
                </Col>

                <Col sm={4} md={4} lg={4}>
                  <Button variant={buttonStyle} type="submit">{buttonTitle}</Button>
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
                  <th className="thStyle">Todo task</th>
                  <th className="thStyle">Edit</th>
                  <th className="thStyle">Delete</th>
                </tr>
              </thead>

              <tbody>
                {state.todos.map(todo => (
                  <tr key={todo.id}>
                    <td className="firstTd">{todo.id}</td>
                    <td>{todo.text}</td>
                    <td onClick={() => {
                      setTodoText(todo.text); // Copia el contenido de texto al input.
                      setEditMode(true);      // Modo edit para handleSubmit.
                      setEditTodo(todo);      // Copia del objeto.
                      inputElement.current.focus();
                    }}>
                      <Button variant="outline-warning" type="button">✏️</Button>
                    </td>
                    <td onClick={() => {
                      dispatch({ type: "delete", payload: todo });
                    }}>
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