// @ts-nocheck
import {
  createBrowserRouter,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { routesConfig } from "./routes";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.css";
import { updateAccessToken } from "./store/reducers/userSlice";

const App = () => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 0,
        staleTime: 0,
        refetchIntervalInBackground: 0,
      },
    },
  });

  const selector = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const router = createHashRouter(
    routesConfig(selector && selector?.user?.user?.roles)
  );

  // axios.defaults.baseURL = "http://92.242.212.93:8350/";
  axios.defaults.baseURL = "http://192.168.111.23:8350/";
  // axios.defaults.baseURL = "http://192.168.111.128:8000/";

  axios.defaults.headers.common["Authorization"] = `Bearer ${selector.user?.access_token}`;

  let isToastShown = false;

  const access_token = selector.user?.access_token;
  const refresh_token = selector.user?.refresh_token;

  let count_toast = 0;

  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  let refreshTokenRetryCount = 0;
  const MAX_REFRESH_TOKEN_RETRY = 1;

  async function refreshAccessToken(originalConfig: any) {
    if (refreshTokenRetryCount >= MAX_REFRESH_TOKEN_RETRY) {
      throw new Error("Max retry count exceeded for refresh token.");
    }

    refreshTokenRetryCount++;

    const refreshTokenResponse = await axios
      .post(`/users/refresh`, {
        access_token,
        refresh_token,
      })
      .then(async (res) => {
        const newAccessToken = res.data.access_token;
        dispatch(updateAccessToken(newAccessToken));

        // Update the default Authorization header for subsequent requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Set custom headers for the repeated request

        const headers = {
          Authorization: `Bearer ${newAccessToken}`,
        };

        const response = await axios.request({
          ...originalConfig,
          headers, // Pass the custom headers to the repeated request
        });

        window.location.reload();

        return response;
      })
      .catch((e) => {
        return redirectToLogin();
      });
    refreshTokenResponse();
  }

  axios.interceptors.response.use(
    (resp) => resp,
    async (error) => {
      const { config: originalConfig, response } = error;

      if (response.status === 401) {
        try {
          await refreshAccessToken(originalConfig);
          if (await refreshAccessToken(originalConfig)) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;
            window.location.reload();
          }
          originalConfig._retry = true;
          return axios(originalConfig);
        } catch (e) { }
      } else if (response.status === 400) {
        toast.error(response.data.detail, {
          style: {
            fontSize: "13px",
          },
        });
      }
      else {
        throw error;
      }
    }
  );

  function redirectToLogin() {
    window.location.href = "/#/login";
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="bottom-left" />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
