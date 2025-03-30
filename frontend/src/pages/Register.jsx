import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { saveToken } from "../utils/auth";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [register, { loading, error }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      saveToken(data.register);
      alert("Registration successful!");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ variables: form });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="Username" />
        <input name="password" onChange={handleChange} type="password" placeholder="Password" />
        <button type="submit" disabled={loading}>Register</button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
