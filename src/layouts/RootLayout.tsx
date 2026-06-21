import { Header } from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen-full">
      <Header />
      <div className="grow pt-14 md:pt-16">
        <Outlet />
      </div>
    </div>
  );
};
