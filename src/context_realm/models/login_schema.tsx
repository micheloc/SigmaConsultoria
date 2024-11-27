import { ObjectSchema } from 'realm';

const login_schema: ObjectSchema = {
  name: 'Login',
  primaryKey: 'objID',
  properties: {
    objID: 'int', // Use 'int' para um número inteiro
    token: 'string',
    usuario: 'string',
    expire: 'date', // Use 'date' para representar data/hora
  },
};

export default login_schema;
