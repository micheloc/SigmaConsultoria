import { ObjectSchema } from 'realm';

const cliente_schema: ObjectSchema = {
  name: 'Cliente',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idUser: 'string',
    nome: 'string',
    email: 'string?',
    registro: 'string?',
    status: 'bool?',
    created: 'date?',
    updated: 'date?',
  },
};

export default cliente_schema;
