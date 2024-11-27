import { ObjectSchema } from 'realm';

const especificacao_schema: ObjectSchema = {
  name: 'Especificacao',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idAvaliacao: 'string',
    especificacao: 'string',
    descricao: 'string',
  },
};

export default especificacao_schema;
