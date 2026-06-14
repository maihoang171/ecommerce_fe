import { useEffect } from "react";
import { useSyncAuthSession } from "./hooks/useAuth";
import { AppRoute } from "./routes/route";
import "./index.css";
import { Toaster } from "sonner";
import { useGetCategoryList } from "./hooks/useCategory";
import logo from "./assets/logo.png";

function App() {
  const { handleSyncAuthSession, isCheckingAuth } = useSyncAuthSession();
  const { handleGetCategoryList } = useGetCategoryList();

  useEffect(() => {
    const initApp = async () => {
      try {
        await handleSyncAuthSession();

        await handleGetCategoryList();
      } catch (error) {
        console.log("Error occurred when initializing app: ", error);
      }
    };
    initApp();
  }, []);

  return isCheckingAuth ? (
    <div className="fixed inset-0 h-screen w-screen flex justify-center items-center">
      <img
        src={logo}
        className="h-20 md:h-24 w-auto object-contain animate-pulse"
        alt="XuXi Loading..."
      />
    </div>
  ) : (
    <div className="h-screen w-full bg-base-100">
      <AppRoute />
      <Toaster />
    </div>
  );
}

export default App;
