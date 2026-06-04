import { AppRoute } from "./routes/route";
import "./index.css";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="h-screen">
      <div className="pt-10">
        <AppRoute />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
