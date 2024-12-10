import Realm, { schemaVersion } from 'realm';
import adversidades_schema from './models/adversidades_schema';
import area_schema from './models/area_schema';
import avaliacao_schema from './models/avaliacao_schema';
import cliente_schema from './models/cliente_schema';
import cultura_schema from './models/cultura_schema';
import especificacao_schema from './models/especificacao_schema';
import fase_schema from './models/fase_schema';
import fazenda_schema from './models/fazenda_schema';
import login_schema from './models/login_schema';
import variedade_schema from './models/variedade_schema';

const context_realm = async (): Promise<Realm> => {
  const config = {
    path: 'SigmaConsultoria',
    schema: [
      adversidades_schema,
      area_schema,
      avaliacao_schema,
      cliente_schema,
      cultura_schema,
      especificacao_schema,
      fase_schema,
      fazenda_schema,
      login_schema,
      variedade_schema,
    ],
    schemaVersion: 2,
  };

  return await Realm.open(config);
};

export default context_realm;
