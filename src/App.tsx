import { useEffect } from "react";
import { useSyncAuthSession } from "./hooks/useAuth";
import { AppRoute } from "./routes/route";
import "./index.css";
import { Toaster } from "sonner";

function App() {
  const { handleSyncAuthSession, isCheckingAuth } = useSyncAuthSession();

  useEffect(() => {
    handleSyncAuthSession();
  }, []);

  return isCheckingAuth ? (
    <img src="../src/assets/logo.png" className="h-screen w-screen flex justify-center items-center"/>
  ) : (
    <div className="h-screen">
      <AppRoute />
      <Toaster />
    </div>
  );
}

export default App;
