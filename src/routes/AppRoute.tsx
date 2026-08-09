import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Category } from "../pages/Category";
import { ProductList } from "../pages/ProductList";
import { RootLayout } from "@/pages/layouts/RootLayout";
import { NotFound } from "@/pages/NotFound";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { SearchProduct } from "@/pages/SearchProducts";

export const AppRoute = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/:parentSlug/:childSlug" element={<ProductList />} />

        <Route path="/:parentSlug" element={<Category />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/product/search" element={<SearchProduct />} />

        <Route path="/not-found" element={<NotFound />} />

        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};
