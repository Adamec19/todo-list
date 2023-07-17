import { Card, Heading, List, Stack } from "@chakra-ui/react";
import { FC } from "react";

import TodoItem from "./TodoItem";
import { TodoSection } from "../types";
import CardMenu from "./CardMenu";

type TodoCardProps = TodoSection;

const TodoCard: FC<TodoCardProps> = (props) => {
  return (
    <Card p={3} minW={{ base: "100%", md: "400px" }} h="fit-content">
      <Stack direction="row" justify="space-between" pb={5}>
        <Heading as="h2">{props.title}</Heading>
        <Stack direction="row" align="center" spacing={0}>
          <CardMenu {...props} />
        </Stack>
      </Stack>
      <List spacing={3.5}>
        {props.todosList.map((item) => (
          <TodoItem {...item} key={item.id} />
        ))}
      </List>
    </Card>
  );
};
export default TodoCard;
