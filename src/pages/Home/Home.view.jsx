import React from "react";
import { Button, Center, Card, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { logout } from "../../apis/login";
import { toaster } from "../../components/ui/toaster";
import logo from "../../assets/logo.png";

export const HomeView = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toaster.success({
      title: "Logout realizado com sucesso",
      description: "Você foi deslogado com sucesso!",
    });
    navigate("/login");
  };

  return (
    <Center w="100%" h="100vh">
      <Card.Root width="520px">
        <Card.Body gap="4">
          <Center w="100%">
            <img src={logo} style={{ width: "100px", objectFit: "cover" }} />
          </Center>

          <Card.Title>Bem-vindo!</Card.Title>

          <Text textAlign="center" color="gray.600">
            Você está logado com sucesso!
          </Text>
        </Card.Body>

        <Card.Footer flex flexDirection={"column"} gap="2">
          <Button
            onClick={handleLogout}
            width={"100%"}
            colorScheme="red"
            variant="outline"
          >
            Logout
          </Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};
