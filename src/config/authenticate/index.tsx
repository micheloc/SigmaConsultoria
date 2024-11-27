import moment from 'moment';
import iLogin from 'types/interfaces/iLogin';

import NetInfo from '@react-native-community/netinfo';

import { createContext, useEffect, useState } from 'react';
import { _user } from 'services/login_service';

type AuthContextData = {
  isLogged: boolean;
  check(): Promise<void>;
  remove_all(): Promise<void>;
  loading_all_cultura(): Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AppProvider = ({ children }: any) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    check();
  }, []);

  /**
   * Este método será utilizado para carregar as informações de acesso do usuário, como token válido ou data válida.
   * @returns valor booleano, referindo sé o usuário pode está logado ou não.
   */
  const check = async (): Promise<void> => {
    try {
      const now = moment(); // Data atual
      const user: iLogin = await _user();
      if (user) {
        const targetDate = moment(user.expire);
        const differenceInDays = targetDate.diff(now, 'days');

        /// Essa comparação será utilizada para carregar os dados referente aos dias.
        setIsLogged(differenceInDays >= 0 && differenceInDays <= 5);
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      console.debug('Erro no checked: ', error);
    }
  };

  const loading_all_cultura = async (): Promise<void> => {
    const net = await NetInfo.fetch();
    if (net.isConnected) {
      // try {
      //   const cultura: any = await api.get('/Cultura');
      //   await _createCulturas(cultura.data);
      //   const fase: any = await api.get('/Fase');
      //   await _createFases(fase.data);
      //   const variedade: any = await api.get('/Variedade');
      //   await _createVariedades(variedade.data);
      //   // Toast.show({
      //   //   type: 'success',
      //   //   text1: `Todos os dados referente a cultura/fase/variedade foram atualizados!`,
      //   //   text1Style: { fontSize: 14 },
      //   // });
      // } catch (error) {
      //   console.debug('Erro ao carregar lista', error);
      // }
    }
  };

  const remove_all = async (): Promise<void> => {
    try {
      // await _removeAllClientes();
      // await _removeAllFazendas();
      // await _removeAllArea();
      // await _removeAllCultura();
      // await _removeAllFase();
      // await _removeAllVariedade();
      // await _removeUser();
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, check, remove_all, loading_all_cultura }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
