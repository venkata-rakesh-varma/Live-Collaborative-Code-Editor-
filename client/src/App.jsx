import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Data router — required for useBlocker to work in EditorPage
const router = createBrowserRouter([
  { path: "/login",        element: <Login /> },
  { path: "/register",     element: <Register /> },
  { path: "/",             element: <Home /> },
  { path: "/create-room",  element: <CreateRoom /> },
  { path: "/join-room",    element: <JoinRoom /> },
  { path: "/editor/:roomId", element: <EditorPage /> },
]);

const toastOptions = {
  style: {
    background: "#0f1526",
    color: "#f1f5f9",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    borderRadius: "10px",
  },
  success: { iconTheme: { primary: "#10b981", secondary: "#ffffff" } },
  error:   { iconTheme: { primary: "#ef4444", secondary: "#ffffff" } },
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={toastOptions} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;