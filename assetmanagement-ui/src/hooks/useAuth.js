import { useAuth } from "../context/AuthContext";

export default function useAuthHook() {
  const auth = useAuth();
  return auth;
}