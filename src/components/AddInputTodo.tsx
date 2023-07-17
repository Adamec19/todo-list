import { AddIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { FC, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { object, string, InferType, ObjectSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { TodoContext } from "../context/todoContext";

type FormType = {
  title: string;
};

const schema: ObjectSchema<FormType> = object({
  title: string().required(),
});

type FormValues = InferType<typeof schema>;

const AddInputTodo: FC = () => {
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
      type: "ADD_SECTION",
      payload: { id: uuidv4(), title: data.title, todosList: [] },
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup size="md">
        <Input
          pr={4.5}
          placeholder="Add title section"
          {...register("title")}
        />
        <InputRightElement>
          <IconButton
            type="submit"
            icon={<AddIcon />}
            aria-label="add title TodoSection"
          />
        </InputRightElement>
      </InputGroup>
      <ErrorMessage
        errors={errors}
        name="title"
        render={({ message }) => (
          <Text fontSize="12px" mt={2} textAlign="left">
            {message}
          </Text>
        )}
      />
    </form>
  );
};

export default AddInputTodo;
