import { useEffect } from "react";
import { useSyncAuthSession } from "./features/auth/hooks/useAuth";
import { AppRoute } from "./routes/AppRoute";
import "./index.css";
import { Toaster } from "sonner";
import logo from "./assets/logo.png";

function App() {
  const { mutate: handleSyncAuthSession, isPending } = useSyncAuthSession();

  useEffect(() => {
    handleSyncAuthSession();
  }, []);

  return isPending ? (
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
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
