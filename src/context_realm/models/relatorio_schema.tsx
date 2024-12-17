import { ObjectSchema } from 'realm';

const relatorio_schema: ObjectSchema = {
  name: 'Relatorio',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idFazenda: 'string',
    idArea: 'string',
    idCultura: 'string',
    idFase: 'string',
    idVariedade: 'string',
    avaliadores: 'string',
    data: 'date?',
    recomendacao: 'string',
    pdf: 'string',
    cultura: 'string',
    fase: 'string',
    variedade: 'string',
  },
};

export default relatorio_schema;
