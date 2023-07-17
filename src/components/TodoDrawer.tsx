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
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";

import "react-datepicker/dist/react-datepicker.css";
import useViewport from "../hooks/useViewport";
import { Priority, Todo, TodoSection } from "../types";
import { TodoContext } from "../context/todoContext";
import { InferType, ObjectSchema, date, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { dateObjectToTimestamp, timestampToDateObject } from "../helper";
import { useMutation, useQueryClient } from "react-query";
import { addTodoToSection, updateTodoInSection } from "../api";

type TodoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
  isEdit: boolean;
  sectionId: string;
};

type FormType = {
  name: string;
  priority: Priority;
  description: string;
  deadLine: Date | null;
};

const schema: ObjectSchema<FormType> = object({
  name: string().required(),
  priority: string().oneOf(["High", "Medium", "Low"]).required(),
  description: string().required().min(4).max(58),
  deadLine: date()
    .typeError("Invalid date format")
    .nullable()
    .default(null)
    .required(),
});

type FormValues = InferType<typeof schema>;

const arrayPriority = ["High", "Medium", "Low"];

const getDeadLine = (deadline: number | undefined) => {
  if (!deadline) {
    return null;
  }
  return timestampToDateObject(deadline);
};

const TodoDrawer: FC<TodoDrawerProps> = ({
  isOpen,
  onClose,
  todo,
  isEdit,
  sectionId,
}) => {
  const [dateValue, setDateValue] = useState<Date | null>(
    getDeadLine(todo?.deadline),
  );

  const { isMobile } = useViewport();
  const { dispatch } = useContext(TodoContext);
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation<TodoSection, Error, Todo>(
    (todo: Todo) => addTodoToSection(sectionId, todo),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("sections");
      },
      onError: (error) => {
        console.error("Chyba při přidávání úkolu do sekce:", error);
      },
    },
  );

  const updateTodoMutation = useMutation<TodoSection, Error, Todo>(
    (todo: Todo) => updateTodoInSection(sectionId, todo),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("sections");
      },
      onError: (error) => {
        console.error("Chyba při aktualizaci úkolu:", error);
      },
    },
  );

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: todo?.name ?? "",
      priority: todo?.priority.value ?? "Low",
      description: todo?.description ?? "",
      deadLine: getDeadLine(todo?.deadline),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onClose();
    reset();
    clearErrors();

    const updatedTodo: Todo = {
      id: todo?.id ?? uuidv4(),
      deadline: dateObjectToTimestamp(data.deadLine) ?? 1111,
      description: data.description,
      isDone: false,
      name: data.name,
      priority: { id: 1, value: data.priority },
    };
    // dispatch({
    //   type: isEdit ? "UPDATE_TODO" : "ADD_TODO",
    //   sectionId,
    //   todo: updatedTodo,
    // });
    if (!isEdit) {
      addTodoMutation.mutate(updatedTodo);
    } else {
      updateTodoMutation.mutate(updatedTodo);
    }
    setDateValue(null);
  };

  const watchRadio = watch("priority");

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
            {isEdit ? "Update todo" : "Create a new todo"}
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  placeholder="Please enter user name"
                  {...register("name")}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }) => (
                    <Text fontSize="12px" mt={2} textAlign="left">
                      {message}
                    </Text>
                  )}
                />
              </Box>

              <Box>
                <RadioGroup value={watchRadio}>
                  <Stack direction="row">
                    {arrayPriority.map((item, index) => (
                      <Radio value={item} key={index} {...register("priority")}>
                        {item}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
                <ErrorMessage
                  errors={errors}
                  name="priority"
                  render={({ message }) => (
                    <Text fontSize="12px" mt={2} textAlign="left">
                      {message}
                    </Text>
                  )}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Dead line</FormLabel>
                <DatePicker
                  placeholderText="dd.mm.yyyy"
                  showYearDropdown
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                  showMonthDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  selected={dateValue}
                  onChange={(date) => {
                    clearErrors("deadLine");
                    if (date instanceof Date) {
                      setDateValue(date);
                      setValue("deadLine", date);
                    }
                  }}
                  onFocus={(e) => {
                    e.target.placeholder = "dd.mm.yyyy";
                  }}
                  onBlur={(e) => {
                    e.target.placeholder = "Dat. narození *";
                  }}
                  customInput={
                    <Input
                      className="datePickerInput"
                      {...register("deadLine")}
                      type="text"
                      required
                      data-test="offerDetail.contactIN.date"
                    />
                  }
                />
                <ErrorMessage
                  errors={errors}
                  name="deadLine"
                  render={({ message }) => (
                    <Text fontSize="12px" mt={2} textAlign="left">
                      {message}
                    </Text>
                  )}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>
                <Textarea id="desc" {...register("description")} />
                <ErrorMessage
                  errors={errors}
                  name="description"
                  render={({ message }) => (
                    <Text fontSize="12px" mt={2} textAlign="left">
                      {message}
                    </Text>
                  )}
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={() => onClose()}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
export default TodoDrawer;
