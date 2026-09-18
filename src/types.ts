export interface LotItem {
  id: string;
  loteNum: string;
  titulo: string;
  categoria: string;
  subcategoria?: string;
  origem: string;
  placaMascarada: string;
  anoModelo?: string;
  fipe?: string;
  fipeNum?: number;
  abaixoFipe?: string;
  valorAtual: string;
  valorAtualNum: number;
  incrementoMinimo: number;
  lances: number;
  visualizacoes: number;
  status: string;
  dataLeilao: string;
  imagem: string;
  fotosExtras?: string[];

  // Veículos (Carros, Motos, Pesados, Utilitários)
  combustivel?: string;
  cambio?: string;
  km?: string;
  cor?: string;
  tracao?: string;
  cilindradas?: string;

  // Imóveis (Casas, Terrenos, Apartamentos, Comerciais)
  tipoImovel?: 'Casa' | 'Terreno' | 'Apartamento' | 'Comercial' | 'Área Rural' | string;
  cidade?: string;
  uf?: string;
  areaTotal?: string;
  areaConstruida?: string;
  quartos?: number;
  vagas?: number;
  ocupacao?: 'Desocupado' | 'Ocupado' | 'Em processo de desocupação' | string;
  matricula?: string;
  iptu?: string;
  valorAvaliacao?: string;
  valorAvaliacaoNum?: number;

  // Materiais e Equipamentos
  condicaoMaterial?: string;
  quantidade?: string;

  leilaoId: string;
  leilaoNome: string;
}

export interface AuctionEvent {
  id: string;
  title: string;
  codigo?: string;
  natureza?: string;
  tipos?: string;
  local?: string;
  dataHora: string;
  dataFim: string;
  badge: string;
  totalLotes: number;
  categoria?: string;
  cards: LotItem[];
}

export interface BannerSlide {
  id: number;
  titulo: string;
  link: string;
  desktopImg: string;
  mobileImg: string;
  badge?: string;
}

export interface UserBid {
  id: string;
  lotId: string;
  lotNum: string;
  lotTitle: string;
  lotImage: string;
  category: string;
  value: number;
  date: string;
  status: 'ganhando' | 'superado' | 'arrematado';
}

export interface RegisteredUser {
  id: string;
  tipoPessoa: 'fisica' | 'juridica';
  nome: string;
  documento: string; // CPF or CNPJ
  rgIe?: string;
  dataNascimento?: string;
  email: string;
  telefone: string;
  cep: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  status: 'habilitado' | 'pendente_documentos' | 'pendente';
  dataCadastro: string;
  termoAceito: boolean;
  limiteCredito?: number;
  docFrente?: string; // Imagem do documento frente
  docVerso?: string; // Imagem do documento verso
  docSelfie?: string; // Foto segurando o documento oficial
  documentosCompletos?: boolean;
}

export interface BidHistoryEntry {
  id: string;
  usuarioNome: string;
  usuarioDocMasc: string;
  valor: number;
  dataHora: string;
  isCurrentUser?: boolean;
}

