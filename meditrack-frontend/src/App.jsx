import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./auth/authContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
