import { Header } from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen-full w-full">
      <Header />
      <div className="grow pt-14 md:pt-16 px-5">
        <Outlet />
      </div>
    </div>
  );
};
