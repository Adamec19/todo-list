import axios, { AxiosResponse } from "axios";
import { Todo, TodoSection } from "../types";

const BASE_URL = "https://64b14183062767bc4825ee27.mockapi.io";

export const getSections = async (): Promise<TodoSection[]> => {
  try {
    const response: AxiosResponse<TodoSection[]> = await axios.get(
      `${BASE_URL}/api/v1/sections`,
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch todos");
  }
};

export const createNewSection = async (section: TodoSection) => {
  try {
    const response = await axios.post<TodoSection>(
      `${BASE_URL}/api/v1/sections`,
      section,
    );
    return response.data;
  } catch (error) {
    throw new Error("Chyba při vytváření nového section.");
  }
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/v1/sections/${sectionId}`);
  } catch (error) {
    throw new Error("Chyba při mazání sekce.");
  }
};

export const addTodoToSection = async (
  sectionId: string,
  todo: Todo,
): Promise<TodoSection> => {
  try {
    const response = await axios.post<TodoSection>(
      `${BASE_URL}/api/v1/sections/${sectionId}/todos`,
      todo,
    );
    return response.data;
  } catch (error) {
    throw new Error("Chyba při přidávání úkolu do sekce.");
  }
};

export const updateTodoInSection = async (
  sectionId: string,
  todo: Todo,
): Promise<TodoSection> => {
  const response = await axios.put(
    `${BASE_URL}/api/v1/sections/${sectionId}/todos/${todo.id}`,
    todo,
  );
  return response.data;
};
