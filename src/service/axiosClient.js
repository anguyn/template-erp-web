import axios from 'axios';

const axiosClient = (authToken, options={}) => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authToken ? authToken : '',
    ...options.headers,
  };

  const client = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_SERVICE_LAYER_URL + '/' + process.env.NEXT_PUBLIC_ODATA_VERSION,
    headers,
    withCredentials: true,
    ...options,
  });

  client.interceptors.request.use(async (config) => config);

  client.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response;
    },
    (error) => {
      throw error;
    }
  );

  return client;
};

export default axiosClient;
