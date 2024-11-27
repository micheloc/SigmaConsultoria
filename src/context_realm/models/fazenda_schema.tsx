import { ObjectSchema } from 'realm';

const fazenda_schema: ObjectSchema = {
  name: 'Fazenda',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idCliente: 'string',
    nome: 'string',
    created: 'date?',
    updated: 'date?',
  },
};

export default fazenda_schema;
