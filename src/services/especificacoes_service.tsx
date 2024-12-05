import context_realm from 'context_realm/index';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';

export const _createEspecificacoe = async (item: iEspecificacoes) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Especificacao', {
        objID: item.objID,
        idAvaliacao: item.idAvaliacao,
        especificacao: item.especificacao,
        descricao: item.descricao,
      });
    });
  } catch (error) {
    console.debug(error);
  }
};

export const _createEspecificacoes = async (items: iEspecificacoes[]): Promise<boolean> => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      items.forEach((item) => {
        realm.create('Especificacao', {
          objID: item.objID,
          idAvaliacao: item.idAvaliacao,
          especificacao: item.especificacao,
          descricao: item.descricao,
        });
      });
    });

    return true;
  } catch (error) {
    console.error('lst area cadastro : ', error);

    return false;
  }
};

export const _getAllEspecificacoes = async () => {
  try {
    const realm = await context_realm();
    return realm.objects('Especificacao');
  } catch (error: any) {
    console.error(error);
  }
};

export const _findEspecificacoes = async (objID: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Especificacao', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findEspecificacoesByFazenda = async (id: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Especificacao').filtered(`idFazenda == '${id}'`);
  } catch (error) {
    console.debug('Não foi possivel carregar a lista de área:', error);
    return [];
  }
};

export const _removeEspecificacoes = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Especificacao', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllEspecificacoes = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allClientes = realm.objects('Especificacao');
      realm.delete(allClientes);
    });
  } catch (error) {
    console.error(error);
  }
};
