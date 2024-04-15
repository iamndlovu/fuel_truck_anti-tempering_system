import axios from 'axios';
const BASE_URL = 'http://localhost:1999/'

const instance = axios.create({
    baseURL: BASE_URL
});

export const setAuthToken = token => {
  if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  else
      delete axios.defaults.headers.common["Authorization"];
}
export default instance;