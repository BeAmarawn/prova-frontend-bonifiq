import axios from 'axios'

const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
}

const axiosInstance = axios.create({
  ...baseConfig,
})

export default axiosInstance
