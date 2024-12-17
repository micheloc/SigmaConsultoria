import context_realm from 'context_realm/index';

export const _createRelatorio = async (item: iRelatorio) => {
  const realm = await context_realm();
  try {
    console.log(item);

    realm.write(() => {
      realm.create('Relatorio', {
        objID: item.objID,
        idFazenda: item.idFazenda,
        idArea: item.idArea,
        idCultura: item.idCultura,
        idFase: item.idFase,
        idVariedade: item.idVariedade,
        avaliadores: item.avaliadores,
        data: item.data,
        recomendacao: item.recomendacao,
        cultura: item.cultura,
        fase: item.fase,
        variedade: item.variedade,
      });
    });
  } catch (error) {
    console.log('Não foi possivel inserir os dados do relatório : ', error);
  }
};

export const _createRelatorios = async (items: iRelatorio[]) => {
  const realm = await context_realm();
  try {
    realm.write(() => {
      items.forEach((item) => {
        realm.create('Relatorio', {
          objID: item.objID,
          idFazenda: item.idFazenda,
          idArea: item.idArea,
          idCultura: item.idCultura,
          idFase: item.idFase,
          idVariedade: item.idVariedade,
          avaliadores: item.avaliadores,
          data: item.data,
          recomendacao: item.recomendacao,
          area: item.area,
          cultura: item.cultura,
          fase: item.fase,
          variedade: item.variedade,
        });
      });
    });
  } catch (error) {
    console.error('Não foi possivel salvar as áreas : ', error);
  }
};

export const _getAllRelatorios = async () => {
  const realm = await context_realm();
  try {
    return realm.objects('Relatorio');
  } catch (error: any) {
    console.error(error);
  }
};

export const _findRelatorio = async (objID: string) => {
  const realm = await context_realm();
  try {
    return await realm.objectForPrimaryKey('Relatorio', objID);
  } catch (error: any) {
    console.error(error);
  }
};

export const _findRelatorioByFazenda = async (id: string) => {
  const realm = await context_realm();
  try {
    return realm.objects('Relatorio').filtered(`idFazenda == '${id}'`);
  } catch (error) {
    console.log('Não foi possivel carregar a lista de relatório : ', error);
  }
};

export const _findRelatorioByFazendaAndFase = async (idFazenda: string, idFase: string) => {
  const realm = await context_realm();
  try {
    // Filtro para 'idFazenda' e 'idFase'
    return realm.objects('Relatorio').filtered(`idFazenda == '${idFazenda}' AND idFase == '${idFase}'`);
  } catch (error) {
    console.log('Não foi possível carregar a lista de relatório: ', error);
  }
};

export const _removeRelatorio = async (objID: string) => {
  const realm = await context_realm();
  try {
    realm.write(() => {
      const resp = realm.objectForPrimaryKey('Relatorio', objID);
      if (resp) {
        realm.delete(resp);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const _removeAllRelatorio = async () => {
  const realm = await context_realm();
  try {
    realm.write(() => {
      const resp = realm.objects('Relatorio');
      realm.delete(resp);
    });
  } catch (error) {
    console.log(error);
  }
};

export const _removeAllRelatorioByFazenda = async (idFazenda: string) => {
  if (!idFazenda) {
    console.log('O idFazenda não pode ser vazio.');
    return;
  }

  try {
    const realm = await context_realm();
    realm.write(() => {
      // Remove diretamente as áreas com o idFazenda especificado
      realm.delete(realm.objects('Relatorio').filtered(`idFazenda == '${idFazenda}'`));
    });
  } catch (error) {
    console.log('Erro ao remover dados do relatório a partir da fazenda: ', error);
  }
};
