import api from 'config/api';
import { _createCulturas, _getAllCultura, _removeAllCultura } from 'services/cultura_service';
import { _createFases, _getAllFase, _removeAllFase } from 'services/fase_service';

import { _user, _userLoggout } from 'services/login_service';
import { _createVariedades, _getAllVariedades, _removeAllVariedade } from 'services/variedade_service';

export const useCultura = () => {
  const lAllCultura = async (): Promise<void> => {
    try {
      /// Essa condição será utilizada para carregar todas as culturas, ao entrar no aplicativo.
      const cultura = await api.get('/Cultura');
      await _createCulturas(cultura.data);

      /// Essa condição será utilizada para carregar todas as fases, ao entrar no aplicativo.
      const fase: any = await api.get('/Fase');
      await _createFases(fase.data);

      /// Essa condição será utilizada para carregar todas as variedades, ao entrar no aplicativo.
      const variedade: any = await api.get('/Variedade');
      await _createVariedades(variedade.data);
    } catch (error: any) {
      console.log('Error no context_provider hooks/ create cultura', error);
    }
  };

  return { lAllCultura };
};
