import iAdversidades from './iAdversidades';
import iEspecificacoes from './iEspecificacoes';

interface iAvaliacao {
  objID: string;
  idArea: string;
  idCultura: string;
  idFase: string;
  idVariedade: string;
  avaliadores: string;
  data: Date;
  image: any[];
  pdf: any[];
  especificacoes: iEspecificacoes[];
  adversidades: iAdversidades[];
  recomendacao: string;
}

export default iAvaliacao;

export interface iAvaliacaoRealm {
  objID: string;
  idArea: string;
  idCultura: string;
  idFase: string;
  idVariedade: string;
  avaliadores: string;
  data: Date;
  image: any[];
  pdf: any[];
  recomendacao: string;
}
