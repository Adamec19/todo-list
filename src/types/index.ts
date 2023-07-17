import { ReactNode } from "react";

type Priority = "Hight" | "Medium" | "Low";

export type TodoSection = {
  id: string;
  title: string;
  todosList: Todo[];
};

export type Todo = {
  id: string;
  text: string;
  title: string;
  isDone: boolean;
  priority: Priority;
  deadline: string;
};

export type ChildrenFC<T = unknown> = React.FC<T & { children: ReactNode }>;
