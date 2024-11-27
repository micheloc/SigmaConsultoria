interface iLogin {
  id: number | null;
  token: string;
  usuario: string;
  expire: Date;
}
export default iLogin;
