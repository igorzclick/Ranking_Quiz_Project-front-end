import axios from 'axios';

export async function loginUser({
  nickname,
  password,
  email,
  passwordConfirm,
}) {
  const response = await axios.post('http://localhost:5000/login', {
    nickname,
    password,
    email,
    passwordConfirm,
  });
  return response.data;
}
