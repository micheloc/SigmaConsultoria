import { ObjectSchema } from 'realm';

const area_schema: ObjectSchema = {
  name: 'Area',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idFazenda: 'string',
    nome: 'string',
    hectares: 'double',
    created: 'date?',
    updated: 'date?',
  },
};

export default area_schema;
