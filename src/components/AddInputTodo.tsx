import { AddIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  // useQuery,
} from "@chakra-ui/react";
import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { object, string, InferType, ObjectSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// import { TodoContext } from "../context/todoContext";
// import { TodoSection } from "../types";
import { createNewSection } from "../api";
import { useMutation, useQueryClient } from "react-query";

type FormType = {
  title: string;
};

const schema: ObjectSchema<FormType> = object({
  title: string().required(),
});

type FormValues = InferType<typeof schema>;

const AddInputTodo: FC = () => {
  // const { dispatch } = useContext(TodoContext);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: "" },
  });
  const createSectionMutation = useMutation(createNewSection, {
    onSuccess: () => {
      queryClient.invalidateQueries("sections");
    },
    onError: (error) => {
      console.error("Chyba při vytváření nového section:", error);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    try {
      // dispatch({
      //   type: "ADD_SECTION",
      //   payload: { id: uuidv4(), title: data.title, todosList: [] },
      // });
      createSectionMutation.mutate({
        id: uuidv4(),
        title: data.title,
        todosList: [],
      });

      reset();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup size="md" maxW={{ base: "100%", md: "400px" }}>
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
