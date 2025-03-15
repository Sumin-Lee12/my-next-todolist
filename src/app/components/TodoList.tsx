import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

type Todo = {
  id: number;
  title: string;
  contents: string;
  isDone: boolean;
};

const getTodos = async () => {
  const res = await fetch("http://localhost:4000/todos");
  const data = await res.json();
  return data;
};

const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
};

export const deleteTodo = async (todoId: number) => {
  const res = await fetch(`http://localhost:4000/todos/${todoId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const switchTodo = async ({
  todoId,
  isDone,
}: {
  todoId: number;
  isDone: boolean;
}) => {
  const res = await fetch(`http://localhost:4000/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify({ isDone }),
  });
  return res.json();
};

export const useSwitchTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: switchTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

const List = ({ listFor }: { listFor: "done" | "todo" }) => {
  const { data: todos, isPending, isError } = useTodos();
  const { mutate: switchTodo } = useSwitchTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const handleSwitch = ({
    todoId,
    isDone,
  }: {
    todoId: number;
    isDone: boolean;
  }) => {
    switchTodo({
      todoId,
      isDone,
    });
  };

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };

  if (isPending) {
    return <div>isPending...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="mt-10">
      <h3
        className={`mb-2 text-white py-1 text-center rounded-md ${
          listFor === "done" ? "bg-blue-500" : "bg-red-500"
        }`}
      >
        {listFor === "done" ? "완료목록" : "할일목록"}
      </h3>
      {todos
        .filter((todo) => {
          if (listFor === "done") {
            return todo.isDone === true;
          } else {
            return todo.isDone === false;
          }
        })
        .map((todo) => {
          return (
            <div
              key={todo.id}
              className="flex flex-row border border-gray-600 rounded-md p-4 w-[500px] max-sm:w-[300px]"
            >
              <div className="w-[80%]">
                <h2 className="h-1/2">{todo.title}</h2>
                <p className="h-1/2">{todo.contents}</p>
              </div>
              <div className="w-[20%] flex gap-2 flex-col justify-center items-end">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md"
                  onClick={() => {
                    handleSwitch({
                      todoId: todo.id,
                      isDone: !todo.isDone,
                    });
                  }}
                >
                  {/* 취소 */}
                  {listFor === "done" ? "취소" : "완료"}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={() => {
                    handleDelete(todo.id);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default List;
