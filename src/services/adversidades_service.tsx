import context_realm from 'context_realm/index';
import iAdversidades from 'types/interfaces/iAdversidades';

export const _createAdversidade = async (item: iAdversidades) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Adversidades', {
        objID: item.objID,
        idAvaliacao: item.idAvaliacao,
        descricao: item.descricao,
        nivel: parseFloat(item.nivel.toString()),
        tipo: item.tipo,
        image: item.image,
      });
    });
  } catch (error) {
    console.debug(error);
  }
};

export const _createAdversidades = async (items: iAdversidades[]): Promise<boolean> => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      items.forEach((item) => {
        realm.create('Adversidades', {
          objID: item.objID,
          idAvaliacao: item.idAvaliacao,
          descricao: item.descricao,
          nivel: parseFloat(item.nivel.toString()),
          tipo: item.tipo,
          image: item.image,
        });
      });
    });

    return true;
  } catch (error) {
    console.error('lst area cadastro : ', error);

    return false;
  }
};

export const _getAllAdversidades = async () => {
  try {
    const realm = await context_realm();
    return realm.objects('Adversidades');
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAdversidades = async (objID: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Adversidades', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAdversidadesByFazenda = async (id: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Adversidades').filtered(`idFazenda == '${id}'`);
  } catch (error) {
    console.debug('Não foi possivel carregar a lista de área:', error);
    return [];
  }
};

export const _removeAdversidades = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Adversidades', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllAdversidades = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allClientes = realm.objects('Adversidades');
      realm.delete(allClientes);
    });
  } catch (error) {
    console.error(error);
  }
};
