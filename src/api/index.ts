import axios, { AxiosResponse } from "axios";
import { TodoSection } from "../types";

export const fetchTodos = async (): Promise<TodoSection[]> => {
  try {
    const response: AxiosResponse<TodoSection[]> = await axios.get(
      "https://64b14183062767bc4825ee27.mockapi.io/api/v1/sections",
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch todos");
  }
};
