import React, { useState } from "react";
import "./App.css";
import { Avatar, Button, Card, Input, Stack, Center } from "@chakra-ui/react";
import { Provider } from "./components/ui/provider";


// import das funções externas
import { loginUser } from "./App.js/auth";
import { clearForm } from "./App.js/formActions";

function App() {
 
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // chamada do login
  const handleLogin = async () => {
    try {
      const data = await loginUser(nickname, password, email);
      console.log("Usuário logado:", data);
      // aqui você pode redirecionar ou salvar token no localStorage
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert("Erro ao fazer login: " + (err?.message || "Tente novamente"));
    }
  };

  // chamada do cancel
  const handleCancel = () => {
    clearForm(setNickname, setPassword, setEmail, setPasswordConfirm);
  };

  return (
    <Provider>
      <Card.Root width="320px">
        <Card.Body gap="4">
          <Center w="100%" h="100%">
          <Avatar.Root size="lg" shape="rounded" >
            <Avatar.Image src="../../public/board-game.ico" alt="" />
            <Center w="100%" h="100%">
              <img src="../../public/board-game.ico" alt="" />
            </Center>
          </Avatar.Root>
          </Center>
          
          <Card.Title mt="2">Cadastro de usuário</Card.Title>
          <Card.Description>
            Crie sua conta e comece a jogar!
          </Card.Description>

          {/* Campos */}
          <Stack gap="3" mt="4">
            <Input
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
             <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirmar Senha"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </Stack>
        </Card.Body>

        <Card.Footer justifyContent="flex-end" gap="2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleLogin}>Entrar</Button>
        </Card.Footer>
      </Card.Root>
    </Provider>
  );
}

export default App;
