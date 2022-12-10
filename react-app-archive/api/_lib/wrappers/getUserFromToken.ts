import axios from "axios";

export const getUserFromToken = (token: string) => 
  axios.post(`${process.env.NHOST_BACKEND_URL}/v1/functions/getUser`, { token })
  .then(response => response.data)