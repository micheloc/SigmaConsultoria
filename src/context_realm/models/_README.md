## MODELS

Essa pasta será utilizada para armazenar os modelos de schema utilizado pelo realm db.

ex:

        import { ObjectSchema } from 'realm';

        const rAreaSchema: ObjectSchema = {
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

        export default rAreaSchema;

Este modelo é utilizado no index.tsx
