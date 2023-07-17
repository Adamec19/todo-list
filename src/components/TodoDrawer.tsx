import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";

import "react-datepicker/dist/react-datepicker.css";
import useViewport from "../hooks/useViewport";
import { Todo } from "../types";
import { TodoContext } from "../context/todoContext";
import { InferType, ObjectSchema, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type TodoDrawerProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  todo?: Todo;
};

type FormType = {
  title: string;
};

const schema: ObjectSchema<FormType> = object({
  title: string().required(),
});

type FormValues = InferType<typeof schema>;

const TodoDrawer: FC<TodoDrawerProps> = ({ isOpen, onClose, onOpen, todo }) => {
  const [startDate, setStartDate] = useState(new Date());
  const { isMobile } = useViewport();
  const { dispatch } = useContext(TodoContext);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch({
      type: "ADD_TODO",
      payload: { id: uuidv4(), title: data.title, todosList: [] },
    });
    reset();
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement={isMobile ? "bottom" : "right"}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {todo?.title ? "Update todo" : "Create a new todo"}
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="username">Name</FormLabel>
                <Input id="username" placeholder="Please enter user name" />
              </Box>

              <Box>
                <FormLabel htmlFor="url">Url</FormLabel>
                <InputGroup>
                  <Input
                    type="url"
                    id="url"
                    placeholder="Please enter domain"
                  />
                  <InputRightAddon>.com</InputRightAddon>
                </InputGroup>
              </Box>

              <Box>
                <RadioGroup>
                  <Stack direction="row">
                    {["Hight", "Medium", "Low"].map((item, index) => (
                      <Radio value={item} key={index}>
                        {item}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>

              <Box>
                <DatePicker
                  placeholderText="...."
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>
                <Textarea id="desc" />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
export default TodoDrawer;
