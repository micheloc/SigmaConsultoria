/**
 * Essa configuração de interface será utilizada para tela de login.
 * @param userName representa o nome do usuário / mas na API está configurado para acessar a partir do e-mail.
 * @param password representa a senha do usuário.
 */
interface iUserPass {
  userName: string; /// representa o nome do usuário que está sendo logado.
  password: string; /// representa a senha do usuário.
}

export default iUserPass;
