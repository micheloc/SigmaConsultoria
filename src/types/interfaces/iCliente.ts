interface iCliente {
  objID: string;
  idUser: string;
  nome: string;
  email: string | null | undefined;
  status: boolean | null | undefined;
  registro: string | null | undefined;
  created: Date;
  updated: Date;
}

export default iCliente;
