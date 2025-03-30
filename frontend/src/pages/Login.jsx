import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { saveToken } from "../utils/auth";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      saveToken(data.login);
      alert("Login successful!");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: form });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" />
        <input name="password" onChange={handleChange} type="password" placeholder="Password" />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
