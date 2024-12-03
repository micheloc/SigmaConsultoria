import context_realm from 'context_realm/index';
import { iAvaliacaoRealm } from 'types/interfaces/iAvaliacao';

/**
 * Este método será utilizado para carregar os dados de uma avaliação no realm DB.
 * @param item refere-se ao objeto de avaliação.
 */
export const _createAvaliacao = async (item: iAvaliacaoRealm): Promise<boolean> => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      realm.create('Avaliacao', {
        objID: item.objID,
        idArea: item.idArea,
        idCultura: item.idCultura,
        idFase: item.idFase,
        idVariedade: item.idVariedade,
        avaliadores: item.avaliadores,
        data: item.data,
        image: item.image,
        pdf: item.pdf,
        recomendacao: item.recomendacao,
      });
    });

    return true;
  } catch (error) {
    console.log('Erro ao cadastrar os dados referente à avaliação : ', error);

    return false;
  }
};

/**
 * Este método será utilizado para carregar todas as avaliações.
 * @returns Todas as avaliações.
 */
export const _getAllAvaliacoes = async () => {
  try {
    const realm = await context_realm();
    return realm.objects('Avaliacao');
  } catch (error: any) {
    console.error(error);
  }
};

/**
 * Este método será utilizado para carregar uma avalização especifica.
 * @param objID refere-se ao objID especifico selecionado.
 * @returns uma avaliação especifica a partir do Id selecionado.
 */
export const _findAvaliacao = async (objID: string) => {
  try {
    const realm = await context_realm();
    return await realm.objectForPrimaryKey('Avaliacao', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findAvaliacaoByArea = async (idArea: string) => {
  try {
    const realm = await context_realm();
    return realm.objects('Avaliacao').filtered(`idArea == '${idArea}'`);
  } catch (error) {
    console.log('Não foi possivel carregar os dados da avaliação :', error);
    return [];
  }
};

/**
 * Este método será utilizado para remover uma avaliação especifica a partir do id selecionado.
 * @param objID refere-se ao Id da avaliação selecionada.
 */
export const _removeAvaliacao = async (objID: string) => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const user = realm.objectForPrimaryKey('Avaliacao', objID);
      if (user) {
        realm.delete(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

/** * Este método será utilizado para limpar todos os dados referente a avaliação do realm DB. */
export const _removeAllAvaliacao = async () => {
  try {
    const realm = await context_realm();
    realm.write(() => {
      const allClientes = realm.objects('Avaliacao');
      realm.delete(allClientes);
    });
  } catch (error) {
    console.error(error);
  }
};
