import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/home";

export const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
