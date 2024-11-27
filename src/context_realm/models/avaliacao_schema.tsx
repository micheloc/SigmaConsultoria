import { ObjectSchema } from 'realm';

const avaliacao_schema: ObjectSchema = {
  name: 'Avaliacao',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idArea: 'string',
    idCultura: 'string',
    idFase: 'string',
    idVariedade: 'string',
    avaliadores: 'string',
    data: 'date',
    image: 'data?[]',
    pdf: 'data?[]',
    recomendacao: 'string',
  },
};

export default avaliacao_schema;
