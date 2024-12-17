export interface iRelatorio {
  objID: string;
  idFazenda: string;
  idArea: string;
  idCultura: string;
  idFase: string;
  idVariedade: string;
  avaliadores: string;
  data: any;
  recomendacao: string;
  area: string;
  cultura: string;
  fase: string;
  variedade: string;
}

export interface iRelatorioExport {
  id: number;
  objID: string;
  idCultura: string;
  idFase: string;
  area: string;
  fase: string;
  cultura: string;
  recomendacao: string;
}
