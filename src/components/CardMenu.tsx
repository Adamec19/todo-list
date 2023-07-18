import {
  AddIcon,
  DeleteIcon,
  HamburgerIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

import TodoDrawer from "./TodoDrawer";
import { TodoSection } from "../types";
import { useMutation, useQueryClient } from "react-query";
import { deleteSection } from "../api";

type CardMenuProps = {
  triggerFiltersButton: () => void;
  todo: TodoSection;
  isViewFilters: boolean;
};

const CardMenu: FC<CardMenuProps> = ({
  triggerFiltersButton,
  todo,
  isViewFilters,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const deleteSectionMutation = useMutation<void, Error>(
    () => deleteSection(todo.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sections");
      },
      onError: (error) => {
        console.error("Chyba při mazání sekce:", error);
      },
    },
  );

  const onDeleteSection = () => {
    deleteSectionMutation.mutate();
  };

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
        </MenuItem>
        <MenuItem icon={<DeleteIcon />} onClick={() => onDeleteSection()}>
          Delete todo
        </MenuItem>
        <MenuItem
          icon={<SettingsIcon />}
          onClick={() => triggerFiltersButton()}
        >
          {isViewFilters ? "Hide filters" : "Use filters"}
        </MenuItem>
      </MenuList>
      <TodoDrawer
        isOpen={isOpen}
        onClose={onClose}
        isEdit={false}
        sectionId={todo.id}
      />
    </Menu>
  );
};
export default CardMenu;
