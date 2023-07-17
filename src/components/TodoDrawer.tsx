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
import { Todo } from "../types";
import { TodoContext } from "../context/todoContext";
import { InferType, ObjectSchema, date, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { dateObjectToTimestamp, timestampToDateObject } from "../helper";

type TodoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
  isEdit: boolean;
  sectionId: string;
};

type Priority = "High" | "Medium" | "Low";

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
    if (isEdit && todo) {
      dispatch({
        type: "UPDATE_TODO",
        sectionId,
        updatedTodo: {
          ...todo,
          deadline: dateObjectToTimestamp(data.deadLine) ?? 11111,
          description: data.description,
          name: data.name,
          priority: { id: 1, value: data.priority },
        },
      });
    } else {
      dispatch({
        type: "ADD_TODO",
        sectionId,
        todo: {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          isDone: false,
          priority: { id: 1, value: data.priority },
          deadline: dateObjectToTimestamp(data.deadLine) ?? 11111,
        },
      });
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
                    {["High", "Medium", "Low"].map((item, index) => (
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
