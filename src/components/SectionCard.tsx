import { Card, Heading, List, Select, Stack, Text } from "@chakra-ui/react";
import { FC, useState } from "react";

import TodoCard from "./TodoCard";
import { Priority, Todo, TodoSection } from "../types";
import SectionActionMenu from "./SectionActionMenu";

type SectionCardProps = TodoSection;

const arrayPriority = [
  { id: 1, value: "High" },
  { id: 2, value: "Medium" },
  { id: 3, value: "Low" },
];

const SectionCard: FC<SectionCardProps> = (props) => {
  const [filteringPriority, setFilteringPriority] = useState<Priority | "">("");
  const [sortingPriority, setSortingPriority] = useState<
    "Highest priority" | "Lowest priority" | ""
  >("");

  const [isViewFilters, setIsViewFilters] = useState(false);

  const handleFiltering = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteringPriority(event.target.value as Priority | "");
  };

  const handleSorting = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortingPriority(
      event.target.value as "Highest priority" | "Lowest priority" | "",
    );
  };

  const sortedTodos = [...props.todosList].sort((a: Todo, b: Todo) => {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };
    if (sortingPriority === "Highest priority") {
      return priorityOrder[a.priority.value] - priorityOrder[b.priority.value];
    } else if (sortingPriority === "Lowest priority") {
      return priorityOrder[b.priority.value] - priorityOrder[a.priority.value];
    } else {
      return 0;
    }
  });

  return (
    <Card p={3} minW={{ base: "100%", md: "400px" }} h="fit-content">
      <Stack direction="row" justify="space-between">
        <Heading as="h2">{props.title}</Heading>
        <Stack direction="row" align="center" spacing={0}>
          <SectionActionMenu
            todo={props}
            triggerFiltersButton={() => setIsViewFilters(!isViewFilters)}
            isViewFilters={isViewFilters}
          />
        </Stack>
      </Stack>
      {isViewFilters && (
        <Stack textAlign="left" direction="row" mt={3}>
          <Stack flex={1}>
            <Text fontSize="14px">Sorting by priority</Text>
            <Select
              placeholder="All options"
              onChange={handleSorting}
              value={sortingPriority}
            >
              {["Highest priority", "Lowest priority"].map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </Select>
          </Stack>
          <Stack flex={1}>
            <Text fontSize="14px">Filtering by priority</Text>
            <Select
              placeholder="All options"
              onChange={handleFiltering}
              value={filteringPriority}
            >
              {arrayPriority.map((item) => (
                <option value={item.value} key={item.id}>
                  {item.value}
                </option>
              ))}
            </Select>
          </Stack>
        </Stack>
      )}
      <List spacing={3.5} pt={5}>
        {sortedTodos
          .filter(
            (todo) =>
              filteringPriority === "" ||
              todo.priority.value === filteringPriority,
          )
          .map((item) => (
            <TodoCard todo={item} key={item.id} sectionId={props.id} />
          ))}
      </List>
    </Card>
  );
};
export default SectionCard;
