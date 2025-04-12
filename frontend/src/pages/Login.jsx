import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { saveToken } from "../utils/auth";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const Login = ({ onLogin }) => {

  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      saveToken(data.login);
      alert("Logged in!");
      onLogin?.(data.login); 
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
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="card-title mb-3 text-center">Login</h3>
        {error && <div className="alert alert-danger">Invalid credentials</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
