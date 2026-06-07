import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSyncAuthSession } from "./hooks/useAuth";
import { AppRoute } from "./routes/route";
import "./index.css";
import { Toaster } from "sonner";

function App() {
  const loginAction = useAuthStore((state) => state.login);
  const { handleSyncAuthSession } = useSyncAuthSession();

  useEffect(() => {
    handleSyncAuthSession();
  }, [loginAction]);
  return (
    <div className="h-screen">
      <AppRoute />
      <Toaster />
    </div>
  );
}

export default App;
