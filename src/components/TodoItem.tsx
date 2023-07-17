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

type TodoItemProps = Todo;

const TodoItem: FC<TodoItemProps> = (props) => {
  const [isCheck, setIsCheck] = useState(props.isDone);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBgColor = () => {
    switch (props.priority) {
      case "Hight":
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
          {props.title}
        </Heading>
        <Text pt="6px" pb="12px">
          {props.text}
        </Text>
        <Text fontSize="12px">Deadline: {props.deadline}</Text>
      </Stack>
      <Tag
        position="absolute"
        w="fit-content"
        top="-10px"
        backgroundColor={getBgColor()}
      >
        {props.priority}
      </Tag>
      <IconButton
        aria-label="Search database"
        icon={<EditIcon />}
        onClick={() => onOpen()}
      />
      <TodoDrawer
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        todo={props}
      />
    </ListItem>
  );
};
export default TodoItem;
