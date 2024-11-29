import context_realm from 'context_realm/index';
import iFazenda from 'types/interfaces/iFazenda';

export const _createFazenda = async (item: iFazenda) => {
  try {
    const realm = await context_realm(); // Obtendo a instância do Realm
    realm.write(() => {
      realm.create('Fazenda', {
        objID: item.objID,
        idCliente: item.idCliente,
        nome: item.nome,
        created: item.created,
        updated: item.updated,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const _createFazendas = async (items: iFazenda[]) => {
  try {
    const realm = await context_realm(); // Obtendo a instância do Realm
    realm.write(() => {
      items.forEach((item) => {
        realm.create('Fazenda', {
          objID: item.objID,
          idCliente: item.idCliente,
          nome: item.nome,
          created: item.created,
          updated: item.updated,
        });
      });
    });
  } catch (error) {
    console.error('lst fazenda cadastro : ', error);
  }
};

export const _getAllFazenda = async () => {
  try {
    const realm = await context_realm();
    const fazenda = realm.objects('Fazenda');
    return fazenda;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findFazenda = async (objID: string) => {
  try {
    const realm = await context_realm();
    const fazenda = await realm.objectForPrimaryKey('Fazenda', objID);
    return fazenda;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findFazendaByCliente = async (id: string) => {
  try {
    const realm = await context_realm();
    const fazendas = realm.objects('Fazenda').filtered('idCliente == $0', id);

    return fazendas;
  } catch (error) {
    console.debug('Error while finding fazendas by idCliente:', error);
    return [];
  }
};

export const _removeFazenda = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Fazenda', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllFazendas = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allFazenda = realm.objects('Fazenda');
      realm.delete(allFazenda);
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllFazendaByCliente = async (idCliente: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const fazendasToDelete = realm.objects('Fazenda').filtered('idCliente == $0', idCliente);
      realm.delete(fazendasToDelete);
    });
  } catch (error) {
    console.error(error);
  }
};
