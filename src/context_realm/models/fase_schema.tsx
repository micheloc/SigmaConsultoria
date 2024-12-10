import { ObjectSchema } from 'realm';

const fase_schema: ObjectSchema = {
  name: 'Fase',
  primaryKey: 'objID',
  properties: {
    objID: 'string',
    idCultura: 'string',
    nome: 'string',
    dapMedio: 'double',
  },
};

export default fase_schema;
