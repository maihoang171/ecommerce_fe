import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home";
import { Register } from "../components/register";
import { Login } from "../components/login";

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
};
