import {
  Box,
  Checkbox,
  Heading,
  IconButton,
  ListItem,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { EditIcon } from "@chakra-ui/icons";

import { Todo } from "../types";
import TodoDrawer from "./TodoDrawer";
import { timestampToDateAndMonth } from "../helper";

type TodoItemProps = {
  sectionID: string;
  todo: Todo;
};

const TodoItem: FC<TodoItemProps> = ({ sectionID, todo }) => {
  const [isCheck, setIsCheck] = useState(todo.isDone);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBgColor = () => {
    switch (todo.priority.value) {
      case "High":
        return "red";
      case "Medium":
        return "blue";
      case "Low":
        return "green";
    }
  };

  return (
    <ListItem
      display="flex"
      p={2}
      boxShadow="rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset"
      borderRadius="6px"
      position="relative"
      backgroundColor={"transparent"}
    >
      <Checkbox isChecked={isCheck} onChange={() => setIsCheck(!isCheck)} />
      <Stack textAlign="left" flex={1} ml={2} spacing={0} pt={2}>
        <Heading as="h3" fontSize="22px">
          {todo.name}
        </Heading>
        <Text pt="6px" pb="12px">
          {todo.description}
        </Text>
        <Text fontSize="12px">
          Deadline: {timestampToDateAndMonth(todo.deadline)}
        </Text>
      </Stack>
      <Tag
        position="absolute"
        w="fit-content"
        top="-10px"
        backgroundColor={getBgColor()}
      >
        {todo.priority.value ? todo.priority.value : "Low"}
      </Tag>
      <IconButton
        aria-label="Search database"
        icon={<EditIcon />}
        onClick={() => onOpen()}
      />
      <TodoDrawer
        isOpen={isOpen}
        onClose={onClose}
        todo={todo}
        isEdit={true}
        sectionId={sectionID}
      />
    </ListItem>
  );
};
export default TodoItem;
