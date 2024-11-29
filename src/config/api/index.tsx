import axios from 'axios';
import { API_URL } from '@env';
import { _user } from 'services/login_service';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config: any) => {
  const user = await _user();
  if (user) {
    if (user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: any) => {
    // Aqui você manipula a resposta antes de ser tratada pelo código que fez a chamada da API
    response.headers['access-control-allow-origin'] = '*'; // Define o cabeçalho access-control-allow-origin
    response.headers['content-length'] = '0'; // Define o cabeçalho content-length
    // response.headers["date"] e response.headers["server"] já são definidos automaticamente pelo axios

    return response;
  },
  (error: any) => {
    // Aqui você pode tratar os erros de requisição, caso necessário
    return Promise.reject(error);
  }
);

export default api;
