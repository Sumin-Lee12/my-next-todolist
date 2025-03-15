"use client";

import List from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import React from "react";

const TodoListPage = () => {
  console.log("bye");

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>넥스트 투두리스트</h1>
      <TodoForm />
      <List listFor="done" />
      <List listFor="todo" />
    </div>
  );
};

export default TodoListPage;
