import { ObjectSchema } from 'realm';

const variedade_schema: ObjectSchema = {
  name: 'Variedade',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idCultura: 'string',
    nome: 'string',
  },
};

export default variedade_schema;
