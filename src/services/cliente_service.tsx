import context_realm from 'context_realm/index';
import iCliente from 'types/interfaces/iCliente';

export const _createCliente = async (obj: iCliente) => {
  try {
    const realm = await context_realm(); // Obtendo a instância do Realm
    realm.write(() => {
      realm.create('Cliente', {
        objID: obj.objID,
        idUser: obj.idUser,
        nome: obj.nome,
        email: obj.email,
        status: obj.status,
        registro: obj.registro,
        created: obj.created,
        updated: obj.updated,
      });
    });
  } catch (error) {
    console.error('error ao criar cliente : ', error);
  }
};

export const _getAllCliente = async () => {
  try {
    const realm = await context_realm();
    const clientes = realm.objects('Cliente');
    return clientes;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findCliente = async (objID: string) => {
  try {
    const realm = await context_realm();
    const access = await realm.objectForPrimaryKey('Cliente', objID);
    return access;
  } catch (error: any) {
    console.error(error);
  }
};

export const _removeCliente = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Cliente', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllClientes = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allClientes = realm.objects('Cliente');
      realm.delete(allClientes); // Remove todos os registros do tipo 'Cliente'
    });
  } catch (error) {
    console.error(error);
  }
};
