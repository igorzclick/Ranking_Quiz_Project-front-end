import axios from "axios"; // se não tiver axios: npm install axios

export async function loginUser(nickname, password, email, passwordConfirm) {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      nickname,
      password,
      email,
      passwordConfirm

    });
    return response.data;
  } catch (error) {
    console.error("Erro na requisição de login:", error);
    throw error;
  }
}