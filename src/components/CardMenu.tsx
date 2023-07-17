import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useContext } from "react";

import { TodoContext } from "../context/todoContext";
import TodoDrawer from "./TodoDrawer";
import { TodoSection } from "../types";

type CardMenuProps = TodoSection;

const CardMenu: FC<CardMenuProps> = ({ id, title, todosList }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dispatch } = useContext(TodoContext);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem icon={<AddIcon />} onClick={onOpen}>
          Add todo
        </MenuItem>{" "}
        <MenuItem icon={<EditIcon />} onClick={onOpen}>
          Edit todo
        </MenuItem>
        <MenuItem
          icon={<DeleteIcon />}
          onClick={() => dispatch({ type: "DELETE_TODO", payload: { id } })}
        >
          Delete todo
        </MenuItem>
      </MenuList>
      <TodoDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </Menu>
  );
};
export default CardMenu;
