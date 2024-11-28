import context_realm from 'context_realm';
import iLogin from 'types/interfaces/iLogin';

/**
 * Este método será utilizado para carregar os dados do usuário ao realm db.
 * @param objeto refere-se ao objeto que contém os dados do usuário logado, como : token, nome do usuário, ata de expiração.
 */
export const _access = async ({ token, usuario, expire }: iLogin) => {
  const realm = await context_realm();
  realm.write(() => {
    realm.create('Login', {
      objID: 1,
      token: token,
      usuario: usuario,
      expire: expire,
    });
  });
};

/**
 * Este método será utilizado para carregar informações do usuário que está conectado ao banco off.
 * @returns dados relacionado ao usuário conectado.
 */
export const _user = async (): Promise<any> => {
  try {
    const realm = await context_realm();
    const access = await realm.objectForPrimaryKey('Login', 1);

    return access;
  } catch (error: any) {}
};

/**
 * Este método será utilizado para encerrar os dados do usuário que está conectado ao banco off.
 */
export const _userLoggout = async () => {
  const realm = await context_realm();
  realm.write(() => {
    const user = realm.objectForPrimaryKey('Login', 1);
    if (user) {
      realm.delete(user);
    }
  });
};
