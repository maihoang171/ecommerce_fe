import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen-full w-full">
      <Header />
      <div className="grow pt-16 md:pt-24 px-4">
        <Outlet />
      </div>
    </div>
  );
};
