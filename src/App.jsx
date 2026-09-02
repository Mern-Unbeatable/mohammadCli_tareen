import { RouterProvider } from "react-router/dom";
import { router } from "./app/router/index.jsx";
import { AuthProvider } from "@/shared/auth/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
