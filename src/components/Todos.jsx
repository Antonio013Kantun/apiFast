import React, { useState, useEffect, useContext, createContext } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";


const TodosContext = createContext({
  todos: [],
  fetchTodos: () => {}
});

// POST ROUTE
// Adding a new AddTodo function
function AddTodo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [item, setItem] = useState("");
  const [imagen, setImagen] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [preparacion, setPreparacion] = useState("");
  const { todos, fetchTodos } = useContext(TodosContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newTodo = {
      id: todos.length + 1,
      item,
      imagen,
      ingredientes: ingredientes.split(","),
      preparacion,
    };

    await fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo)
    });
    fetchTodos();
    onClose();
  };
  // Returning the form to be rendered
  
  return (
<> <Button onClick={onOpen} colorScheme="blue" mb={4}>Agregar Comida</Button>
<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nueva Comida</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  placeholder="Nombre de la comida"
                  onChange={(e) => setItem(e.target.value)}
                />
                <Input
                  placeholder="Link de la imagen"
                  onChange={(e) => setImagen(e.target.value)}
                />
                <Input
                  placeholder="Ingredientes (separados por comas)"
                  onChange={(e) => setIngredientes(e.target.value)}
                />
                <Input
                  placeholder="Preparación"
                  onChange={(e) => setPreparacion(e.target.value)}
                />
                <Button type="submit" colorScheme="blue" mt={4}>Agregar</Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
</>
    
    
  )
}


// PUT ROUTE
function UpdateTodo({ todo, fetchTodos }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedItem, setUpdatedItem] = useState(todo.item);
  const [updatedImagen, setUpdatedImagen] = useState(todo.imagen);
  const [updatedIngredientes, setUpdatedIngredientes] = useState(todo.ingredientes.join(", "));
  const [updatedPreparacion, setUpdatedPreparacion] = useState(todo.preparacion);

  const handleUpdate = async () => {
    const updatedTodo = {
      ...todo,
      item: updatedItem,
      imagen: updatedImagen,
      ingredientes: updatedIngredientes.split(","),
      preparacion: updatedPreparacion,
    };

    await fetch(`http://localhost:8000/todo/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo)
    });
    fetchTodos();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">Actualizar Comida</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Actualizar Comida</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input
                value={updatedItem}
                onChange={(e) => setUpdatedItem(e.target.value)}
                placeholder="Nombre de la comida"
              />
              <Input
                value={updatedImagen}
                onChange={(e) => setUpdatedImagen(e.target.value)}
                placeholder="Link de la imagen"
              />
              <Input
                value={updatedIngredientes}
                onChange={(e) => setUpdatedIngredientes(e.target.value)}
                placeholder="Ingredientes (separados por comas)"
              />
              <Input
                value={updatedPreparacion}
                onChange={(e) => setUpdatedPreparacion(e.target.value)}
                placeholder="Preparación"
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdate}>Guardar Cambios</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


// DELETE ROUTE
function DeleteTodo({id}) {
  const {fetchTodos} = React.useContext(TodosContext)

  const deleteTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: { "id": id }
    })
    await fetchTodos()
  }

  return (
    <Button
  h="2rem"           // Increase the height
  fontSize="1rem"    // Increase the font size
  fontWeight="bold"  // Make the text bold
  colorScheme="yellow" // Change the color scheme (you can choose from different color schemes)
  borderRadius="10px" // Add rounded corners
  boxShadow="md"     // Add a small box shadow
  _hover={{
    bg: 'red.500',   // Change the background color on hover
  }}
  size="sm"
  onClick={deleteTodo}>
  Delete Todo
</Button>
  )
}


function TodoHelper({ todo, fetchTodos }) {
  return (
    <Box p={1} shadow="sm">
      <Flex direction="column" align="center" justify="center">
        <Text mt={4} as="div" fontSize="xl" fontWeight="bold">
          {todo.item}
        </Text>
        {todo.imagen && (
          <img 
            src={todo.imagen} 
            alt={todo.item} 
            style={{ width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px' }} 
          />
        )}
        <Button
          mt={3}
          colorScheme="blue"
          onClick={() => {/* aquí tu lógica para "Ver Receta" */}}
        >
          Ver Receta
        </Button>
        <Flex mt={4}>
          <UpdateTodo todo={todo} fetchTodos={fetchTodos} />
          <DeleteTodo id={todo.id} fetchTodos={fetchTodos} />
        </Flex>
      </Flex>
    </Box>
  );
}


// EXPORT TOODS
export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/todo");
    const data = await response.json();
    setTodos(data.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

// REPLACE THE RETURN WITH A NEW AFTER ADDING THE PUT ROUTE
  return (
    <TodosContext.Provider value={{ todos, fetchTodos }}>
      <AddTodo />
      <SimpleGrid columns={3} spacing={5}>
        {todos.map((todo) => (
          <TodoHelper 
            key={todo.id}
            todo={todo}
            fetchTodos={fetchTodos} 
          />
        ))}
      </SimpleGrid>
    </TodosContext.Provider>
  )
}