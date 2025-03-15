import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const addTodo = async (newTodo: {
  title: string;
  contents: string;
  isDone: boolean;
}) => {
  const res = await fetch("http://localhost:4000/todos", {
    method: "POST",
    body: JSON.stringify(newTodo),
  });
  return res.json();
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};


const TodoForm = () => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const { mutate: addTodo } = useAddTodo();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo({ title, contents, isDone: false });
  };

  return (
    <form className="flex gap-2 my-5" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="제목"
        className="border border-gray-300 p-2 rounded-md"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="내용"
        className="border border-gray-300 p-2 rounded-md"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
      >
        추가
      </button>
    </form>
  );
};

export default TodoForm;
