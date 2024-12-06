import context_realm from 'context_realm/index';
import iCultura from 'types/interfaces/iCultura';

/**
 * Este método, tem como objetivo adicionar a cultura informada ao banco realm.db
 * @param item refere-se ao objeto de cultura.
 */
export const _createCultura = async (item: iCultura) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Cultura', {
        objID: item.objID,
        nome: item.nome,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const _createCulturas = async (items: iCultura[]) => {
  try {
    const realm = await context_realm();

    // Coletando todos os objIDs para verificar em um único acesso
    const existingIds = new Set(realm.objects('Cultura').map((item: any) => item.objID));

    const newItems = items.filter((item) => !existingIds.has(item.objID));

    // Agora criamos as novas culturas em um único bloco de escrita
    if (newItems.length > 0) {
      realm.write(() => {
        newItems.forEach((item) => {
          realm.create('Cultura', {
            objID: item.objID,
            nome: item.nome,
          });
        });
      });
    }
  } catch (error) {
    console.error('Erro ao registrar a lista de culturas: ', error);
  }
};

export const _getAllCultura = async () => {
  try {
    const realm = await context_realm();
    const cultura = realm.objects('Cultura');
    return cultura;
  } catch (error: any) {
    console.error(error);
  }
};

export const _findCultura = async (objID: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Cultura', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _removeAllCultura = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const remove = realm.objects('Cultura');
      realm.delete(remove);
    });
  } catch (error) {
    console.error(error);
  }
};
