import { Dispatch, createContext, useReducer } from "react";

import { ChildrenFC, Todo, TodoSection } from "../types";

interface TodoContextType {
  sections: TodoSection[];
  dispatch: Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextType>({
  sections: [],
  dispatch: () => {},
});

type TodoAction =
  | { type: "SET_TODO"; payload: TodoSection[] }
  | { type: "ADD_SECTION"; payload: TodoSection }
  | { type: "ADD_TODO"; sectionId: string; todo: Todo }
  | {
      type: "UPDATE_TODO";
      sectionId: string;
      todo: Todo;
    }
  | { type: "DELETE_TODO"; payload: { id: string } };

const initialSections: TodoSection[] | null = [];

const addTodo = (sections: TodoSection[], sectionId: string, todo: Todo) => {
  const updatedSections = sections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          todosList: [todo, ...section.todosList],
        }
      : section,
  );

  return updatedSections;
};

const updateTodo = (
  sections: TodoSection[],
  sectionId: string,
  updatedTodo: Todo,
) => {
  const updatedSections = sections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          todosList: section.todosList.map((todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
          ),
        }
      : section,
  );
  return updatedSections;
};

const todoReducer = (state: TodoSection[], action: TodoAction) => {
  switch (action.type) {
    case "SET_TODO":
      return action.payload;
    case "ADD_SECTION":
      return [...state, action.payload];
    case "ADD_TODO":
      return addTodo(state, action.sectionId, action.todo);
    case "UPDATE_TODO":
      return updateTodo(state, action.sectionId, action.todo);
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);
    default:
      return state;
  }
};

export const TodoProvider: ChildrenFC = ({ children }) => {
  const [sections, dispatch] = useReducer(todoReducer, initialSections);

  return (
    <TodoContext.Provider value={{ sections, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
