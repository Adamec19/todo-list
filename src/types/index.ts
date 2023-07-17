import { ReactNode } from "react";

type Priority = "High" | "Medium" | "Low";

export type TodoSection = {
  id: string;
  title: string;
  todosList: Todo[];
};

export type Todo = {
  id: string;
  name: string;
  description: string;
  isDone: boolean;
  priority: { id: number; value: Priority };
  deadline: number;
};

export type ChildrenFC<T = unknown> = React.FC<T & { children: ReactNode }>;
