const http = axios.create({
  baseURL: "http://localhost:3000/printer",
  timeout: 200000,
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.response.use(
  response => {
    return Promise.resolve(response.data);
  },
  error => {
    return error.response
      ? Promise.reject(error.response.data)
      : Promise.reject(error);
  }
);
