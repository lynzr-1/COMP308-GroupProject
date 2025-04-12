import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { saveToken } from "../utils/auth";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [register, { loading, error }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      saveToken(data.register);
      alert("Account created!");
      onRegister?.(data.register);
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
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="card-title mb-3 text-center">Register</h3>
        {error && <div className="alert alert-danger">Username may already be taken</div>}
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
          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
