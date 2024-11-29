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
    console.error('lst area cadastro : ', error);
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
    const areas = realm.objects('Area').filtered('idFazenda == $0', id);

    return areas;
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
  try {
    const realm = await context_realm();
    realm.write(() => {
      // Filtra todas as áreas com o idFazenda especificado
      const areasToDelete = realm.objects('Area').filtered('idFazenda == $0', idFazenda);

      // Remove todas as áreas encontradas
      realm.delete(areasToDelete);
    });
  } catch (error) {
    console.error(error);
  }
};
