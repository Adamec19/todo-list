import { Dispatch, createContext, useReducer } from "react";

import { ChildrenFC, TodoSection } from "../types";

interface TodoContextType {
  todos: TodoSection[];
  dispatch: Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  dispatch: () => {},
});

type TodoAction =
  | { type: "SET_TODO"; payload: TodoSection[] }
  | { type: "ADD_TODO"; payload: TodoSection }
  | { type: "DELETE_TODO"; payload: { id: string } };

const initialTodos: TodoSection[] | null = [];

const todoReducer = (state: TodoSection[], action: TodoAction) => {
  switch (action.type) {
    case "SET_TODO":
      return action.payload;
    case "ADD_TODO":
      return [...state, action.payload];
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);
    default:
      return state;
  }
};

export const TodoProvider: ChildrenFC = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
