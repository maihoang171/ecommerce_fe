import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Category } from "../pages/Category";
import { ProductList } from "../pages/ProductList";
import { RootLayout } from "@/layouts/RootLayout";

export const AppRoute = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/category/:parentSlug/:childSlug"
          element={<ProductList />}
        />

        <Route path="/category/:parentSlug" element={<Category />} />
      </Route>
    </Routes>
  );
};
