import { Stack, Heading, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { TodoContext } from "./context/todoContext";
import TodoCard from "./components/TodoCard";
import { fetchTodos } from "./api";
import AddInputTodo from "./components/AddInputTodo";

export const App = () => {
  const { todos, dispatch } = useContext(TodoContext);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const fetchAndSetTodos = async () => {
      try {
        const fetchedTodos = await fetchTodos();
        dispatch({ type: "SET_TODO", payload: fetchedTodos });
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAndSetTodos();
  }, []);

  if (!isLoaded) {
    return (
      <Stack justify="center" align="center" h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Stack>
    );
  }

  return (
    <Stack p={3} h="100vh">
      <Stack as="nav" align="flex-end">
        <ColorModeSwitcher />
      </Stack>
      <Stack as="main" textAlign="center" fontSize="xl" flex={1}>
        <Heading as="h1">TODO LIST</Heading>
        <AddInputTodo />
        <Stack
          direction={{ base: "column", md: "row" }}
          w="100%"
          overflowX={{ md: "auto" }}
          py={5}
          flex={1}
        >
          {todos.map((item) => (
            <TodoCard {...item} key={item.id} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
