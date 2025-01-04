import axios, { AxiosInstance } from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { store } from "../store/store";
import { clearUserData } from "../redux/authSlice";



export const useApi = (): AxiosInstance => {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
  });

  // Attach request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Attach response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;

      if (response && response.status === 403) {
        console.error("403 error: Unauthorized access. Logging out.");
        store.dispatch(clearUserData());
        const auth = getAuth();
        auth.signOut().then(() => {
          window.location.href = "/"; // Redirect to login or home page
        });
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
