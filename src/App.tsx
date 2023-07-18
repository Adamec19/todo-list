import { Stack, Heading, Spinner } from "@chakra-ui/react";

import SectionCard from "./components/SectionCard";
import { getSections } from "./api";
import AddInputSection from "./components/AddInputSection";
import { useQuery } from "react-query";
import { TodoSection } from "./types";

export const App = () => {
  const {
    data: sections,
    isLoading,
    error,
  } = useQuery<TodoSection[] | undefined, Error>("sections", getSections, {});

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
      <Stack as="main" textAlign="center" fontSize="xl" flex={1}>
        <Heading as="h1">TODO LIST</Heading>
        <AddInputSection />
        <Stack
          direction={{ base: "column", md: "row" }}
          w="100%"
          overflowX={{ md: "auto" }}
          py={5}
          flex={1}
        >
          {sections?.map((item) => (
            <SectionCard {...item} key={item.id} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
