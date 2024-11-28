interface iLogin {
  id: number | null | undefined;
  token: string;
  usuario: string;
  expire: Date;
}
export default iLogin;
