import context_realm from 'context_realm/index';
import iArea from 'types/interfaces/iArea';

export const _createArea = async (item: iArea) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Area', {
        objID: item.objID,
        idFazenda: item.idFazenda,
        nome: item.nome,
        hectares: item.hectares,
        created: item.created,
        updated: item.updated,
      });
    });
  } catch (error) {
    console.debug(error);
  }
};

export const _createAreas = async (items: iArea[]) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      items.forEach((item) => {
        realm.create('Area', {
          objID: item.objID,
          idFazenda: item.idFazenda,
          nome: item.nome,
          hectares: parseFloat(item.hectares.toString()),
          created: item.created,
          updated: item.updated,
        });
      });
    });
  } catch (error) {
    console.error('Não foi possivel salvar as áreas : ', error);
  }
};

export const _getAllArea = async () => {
  try {
    const realm = await context_realm();
    const clientes = realm.objects('Area');
    return clientes;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findArea = async (objID: string) => {
  try {
    const realm = await context_realm();
    const access = await realm.objectForPrimaryKey('Area', objID);
    return access;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAreaByFazenda = async (id: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Area').filtered(`idFazenda == '${id}'`);
  } catch (error) {
    console.debug('Não foi possivel carregar a lista de área:', error);
    return [];
  }
};

export const _removeArea = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Area', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllArea = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allClientes = realm.objects('Area');
      realm.delete(allClientes); // Remove todos os registros do tipo 'Cliente'
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllAreaByFazenda = async (idFazenda: string) => {
  if (!idFazenda) {
    console.log('O idFazenda não pode ser vazio.');
    return;
  }

  try {
    const realm = await context_realm();
    realm.write(() => {
      // Remove diretamente as áreas com o idFazenda especificado
      realm.delete(realm.objects('Area').filtered('idFazenda == $0', idFazenda));
    });
  } catch (error) {
    console.log('Erro ao remover áreas: ', error);
  }
};
