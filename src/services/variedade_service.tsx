import context_realm from 'context_realm/index';
import iVariedade from 'types/interfaces/iVariedade';

export const _createVariedade = async (item: iVariedade) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Variedade', {
        objID: item.objID,
        idCultura: item.idCultura,
        nome: item.nome,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const _createVariedades = async (items: iVariedade[]) => {
  try {
    const realm = await context_realm();

    // Coletando todos os objIDs para verificar em um único acesso
    const existingIds = new Set(realm.objects('Variedade').map((item: any) => item.objID));

    // Filtrando os itens que não existem
    const newItems = items.filter((item) => !existingIds.has(item.objID));

    // Criando as novas variedades em um único bloco de escrita
    if (newItems.length > 0) {
      realm.write(() => {
        newItems.forEach((item) => {
          realm.create('Variedade', {
            objID: item.objID,
            idCultura: item.idCultura,
            nome: item.nome,
          });
        });
      });
    }
  } catch (error) {
    console.error('Erro ao registrar a lista de variedades: ', error);
  }
};

export const _updateVariedade = async (item: iVariedade) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const existingItem = realm.objectForPrimaryKey('Variedade', item.objID);
      if (existingItem) {
        // Atualizar propriedades
        existingItem.idCultura = item.idCultura;
        existingItem.nome = item.nome;
      } else {
        // Criar novo objeto
        realm.create('Variedade', {
          objID: item.objID,
          idCultura: item.idCultura,
          nome: item.nome,
        });
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar/criar Variedade:', error);
  }
};

export const _getAllVariedades = async () => {
  try {
    const realm = await context_realm();
    return realm.objects('Variedade');
  } catch (error: any) {
    console.error(error);
  }
};

export const _findVariedades = async (id: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Variedade', id);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAllVariedadesByCultura = async (id: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Variedade').filtered(`idCultura == '${id}'`);
  } catch (error) {
    console.debug('Erro ao carregar a lista de variedades a partir da cultura:', error);
    return [];
  }
};

export const _removeVariedade = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const variedade = realm.objectForPrimaryKey('Variedade', objID);
      if (variedade) {
        realm.delete(variedade);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllVariedade = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const remove = realm.objects('Variedade');
      realm.delete(remove);
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeVariedadeByCultura = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const variedade = realm.objectForPrimaryKey('Variedade', objID);
      if (variedade) {
        realm.delete(variedade);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
