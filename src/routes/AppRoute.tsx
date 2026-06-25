import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Category } from "../pages/Category";
import { ProductList } from "../pages/ProductList";
import { RootLayout } from "@/layouts/RootLayout";
import { NotFound } from "@/pages/NotFound";

export const AppRoute = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/:parentSlug/:childSlug" element={<ProductList />} />

        <Route path="/:parentSlug" element={<Category />} />

        <Route path="/not-found" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
