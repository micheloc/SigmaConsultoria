import context_realm from 'context_realm/index';
import iFase from 'types/interfaces/iFase';

export const _createFase = async (item: iFase) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Fase', {
        objID: item.objID,
        idCultura: item.idCultura,
        nome: item.nome,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const _createFases = async (items: iFase[]) => {
  try {
    const realm = await context_realm();

    // Coletando todos os objIDs para verificar em um único acesso
    const existingIds = new Set(realm.objects('Fase').map((item: any) => item.objID));

    // Filtrando os itens que não existem
    const newItems = items.filter((item) => !existingIds.has(item.objID));

    // Criando as novas fases em um único bloco de escrita
    if (newItems.length > 0) {
      realm.write(() => {
        newItems.forEach((item) => {
          realm.create('Fase', {
            objID: item.objID,
            idCultura: item.idCultura,
            nome: item.nome,
          });
        });
      });
    }
  } catch (error) {
    console.error('Erro ao registrar a lista de fases: ', error);
  }
};

export const _getAllFase = async () => {
  try {
    const realm = await context_realm();
    return realm.objects('Fase');
  } catch (error: any) {
    console.error(error);
  }
};

export const _findFase = async (objID: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Fase', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAllFaseByCultura = async (id: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Fase').filtered('idCultura == $0', id);
  } catch (error) {
    console.debug('Erro ao carregar a lista de fases a partir do id da cultura:', error);
    return [];
  }
};

export const _removeAllFase = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const remove = realm.objects('Fase');
      realm.delete(remove);
    });
  } catch (error) {
    console.error(error);
  }
};
