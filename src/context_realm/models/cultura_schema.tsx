import { ObjectSchema } from 'realm';

const cultura_schema: ObjectSchema = {
  name: 'Cultura',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    nome: 'string',
  },
};

export default cultura_schema;
