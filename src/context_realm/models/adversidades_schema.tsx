import { ObjectSchema } from 'realm';

const adversidades_schema: ObjectSchema = {
  name: 'Adversidades',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idAvaliacao: 'string',
    image: 'string?',
    descricao: 'string',
    nivel: 'float',
    tipo: 'string',
  },
};

export default adversidades_schema;
