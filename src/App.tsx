import { Stack, Heading, Spinner } from "@chakra-ui/react";
import { useContext } from "react";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { TodoContext } from "./context/todoContext";
import TodoSectionCard from "./components/TodoSectionCard";
import { getSections } from "./api";
import AddInputTodo from "./components/AddInputTodo";
import { useQuery } from "react-query";
import { TodoSection } from "./types";

export const App = () => {
  // const { dispatch, sections } = useContext(TodoContext);
  const {
    data: sections,
    isLoading,
    error,
  } = useQuery<TodoSection[] | undefined, Error>("sections", getSections, {
    // onSuccess: (todos) => {
    //   const section: TodoSection[] | undefined = todos;
    //   if (section) {
    //     dispatch({ type: "SET_TODO", payload: section });
    //   }
    // },
  });

  if (isLoading) {
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

  if (error) {
    return (
      <Stack justify="center" align="center" h="100vh">
        Error: {error.message}
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
          {sections?.map((item) => (
            <TodoSectionCard {...item} key={item.id} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
