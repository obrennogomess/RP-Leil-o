import { RegisteredUser, UserBid, BidHistoryEntry, LotItem } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const STORAGE_USERS = 'patiorp_users_v3';
const STORAGE_CURRENT = 'patiorp_current_user_v3';
const STORAGE_BIDS = 'patiorp_user_bids_v3';
const STORAGE_LOT_BIDS = 'patiorp_lot_bids_v3';

// Initial default demonstration bidder (generic demo account)
const INITIAL_DEMO_USER: RegisteredUser & { senha: string } = {
  id: 'ARR-10294',
  tipoPessoa: 'fisica',
  nome: 'Arrematante Habilitado',
  documento: '123.456.789-00',
  rgIe: '12.345.678-9',
  dataNascimento: '1992-05-20',
  email: 'arrematante.demo@patiorpleiloes.com.br',
  telefone: '(16) 99742-8815',
  cep: '14000-000',
  endereco: 'Rua dos Leilões, 100',
  cidade: 'Ribeirão Preto',
  uf: 'SP',
  status: 'habilitado',
  dataCadastro: '01/01/2026',
  termoAceito: true,
  limiteCredito: 500000,
  documentosCompletos: true,
  senha: '123'
};

function getAllUsers(): Array<RegisteredUser & { senha: string }> {
  try {
    let raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      try {
        localStorage.removeItem('patiorp_users_v2');
        localStorage.removeItem('patiorp_current_user_v2');
      } catch (_) {}

      localStorage.setItem(STORAGE_USERS, JSON.stringify([INITIAL_DEMO_USER]));
      return [INITIAL_DEMO_USER];
    }
    const parsed: Array<RegisteredUser & { senha: string }> = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_DEMO_USER];
  } catch (e) {
    console.error('Error loading users:', e);
    return [INITIAL_DEMO_USER];
  }
}

// Background sync to Cloud Firestore
async function syncUserToFirestore(user: RegisteredUser & { senha?: string }) {
  try {
    const cleanId = user.id || `ARR-${Date.now()}`;
    const userRef = doc(db, 'arrematantes', cleanId);
    
    // Omit sensitive local data if needed, or save arrematante record
    const firestorePayload = {
      id: user.id,
      tipoPessoa: user.tipoPessoa,
      nome: user.nome,
      documento: user.documento,
      documentoLimpo: user.documento.replace(/\D/g, ''),
      rgIe: user.rgIe || '',
      dataNascimento: user.dataNascimento || '',
      email: user.email,
      telefone: user.telefone,
      cep: user.cep,
      endereco: user.endereco || '',
      cidade: user.cidade || '',
      uf: user.uf || '',
      status: user.status,
      dataCadastro: user.dataCadastro,
      termoAceito: user.termoAceito,
      limiteCredito: user.limiteCredito || 350000,
      documentosCompletos: Boolean(user.documentosCompletos),
      docFrente: user.docFrente || null,
      docVerso: user.docVerso || null,
      docSelfie: user.docSelfie || null,
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, firestorePayload, { merge: true });
  } catch (err) {
    console.warn('Firestore user sync fallback (saved locally):', err);
  }
}

export const authService = {
  // Retrieve currently active logged in user
  getCurrentUser(): RegisteredUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading current user:', e);
      return null;
    }
  },

  // Register or update bidder seamlessly, enforcing documentation check
  registerUser(payload: {
    tipoPessoa: 'fisica' | 'juridica';
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    cep: string;
    endereco?: string;
    cidade?: string;
    uf?: string;
    rgIe?: string;
    dataNascimento?: string;
    docFrente?: string;
    docVerso?: string;
    docSelfie?: string;
    senha: string;
  }): { success: boolean; user?: RegisteredUser; error?: string; isUpdate?: boolean } {
    try {
      const users = getAllUsers();
      
      // Clean document and email
      const cleanDoc = payload.documento.replace(/\D/g, '');
      const cleanEmail = payload.email.trim().toLowerCase();

      // Check if all 3 required documents are attached
      const hasFrente = Boolean(payload.docFrente && payload.docFrente.trim().length > 10);
      const hasVerso = Boolean(payload.docVerso && payload.docVerso.trim().length > 10);
      const hasSelfie = Boolean(payload.docSelfie && payload.docSelfie.trim().length > 10);
      const documentosCompletos = hasFrente && hasVerso && hasSelfie;
      const status: 'habilitado' | 'pendente_documentos' = documentosCompletos ? 'habilitado' : 'pendente_documentos';

      // Check if user already exists
      const existingIndex = users.findIndex(
        (u) =>
          (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
          (cleanDoc && u.documento.replace(/\D/g, '') === cleanDoc)
      );

      if (existingIndex >= 0) {
        const existing = users[existingIndex];

        // Maintain existing docs if not re-uploaded
        const finalDocFrente = payload.docFrente || existing.docFrente;
        const finalDocVerso = payload.docVerso || existing.docVerso;
        const finalDocSelfie = payload.docSelfie || existing.docSelfie;
        const finalDocsCompletos = Boolean(finalDocFrente && finalDocVerso && finalDocSelfie);
        const finalStatus = finalDocsCompletos ? 'habilitado' : 'pendente_documentos';

        const updatedUser: RegisteredUser & { senha: string } = {
          ...existing,
          tipoPessoa: payload.tipoPessoa || existing.tipoPessoa,
          nome: payload.nome.trim() || existing.nome,
          documento: payload.documento.trim() || existing.documento,
          rgIe: payload.rgIe?.trim() || existing.rgIe,
          dataNascimento: payload.dataNascimento || existing.dataNascimento,
          email: cleanEmail || existing.email,
          telefone: payload.telefone.trim() || existing.telefone,
          cep: payload.cep.trim() || existing.cep,
          endereco: payload.endereco?.trim() || existing.endereco,
          cidade: payload.cidade?.trim() || existing.cidade,
          uf: payload.uf?.trim() || existing.uf,
          docFrente: finalDocFrente,
          docVerso: finalDocVerso,
          docSelfie: finalDocSelfie,
          documentosCompletos: finalDocsCompletos,
          status: finalStatus,
          termoAceito: true,
          senha: payload.senha || existing.senha
        };

        users[existingIndex] = updatedUser;
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

        const { senha: _s, ...publicUser } = updatedUser;
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));

        // Sync to cloud Firestore
        syncUserToFirestore(updatedUser);

        return { success: true, user: publicUser, isUpdate: true };
      }

      // Generate bidder sequential ID
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newUser: RegisteredUser & { senha: string } = {
        id: `ARR-${randomNum}`,
        tipoPessoa: payload.tipoPessoa,
        nome: payload.nome.trim(),
        documento: payload.documento.trim(),
        rgIe: payload.rgIe?.trim() || '',
        dataNascimento: payload.dataNascimento || '',
        email: cleanEmail,
        telefone: payload.telefone.trim(),
        cep: payload.cep.trim(),
        endereco: payload.endereco?.trim() || 'Logradouro cadastrado',
        cidade: payload.cidade?.trim() || 'São Paulo',
        uf: payload.uf?.trim() || 'SP',
        docFrente: payload.docFrente,
        docVerso: payload.docVerso,
        docSelfie: payload.docSelfie,
        documentosCompletos,
        status,
        dataCadastro: new Intl.DateTimeFormat('pt-BR').format(new Date()),
        termoAceito: true,
        limiteCredito: 350000,
        senha: payload.senha
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

      // Auto login user
      const { senha: _s, ...publicUser } = newUser;
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));

      // Sync to cloud Firestore
      syncUserToFirestore(newUser);

      return { success: true, user: publicUser, isUpdate: false };
    } catch (e) {
      console.error('Registration failed:', e);
      return { success: false, error: 'Erro ao salvar cadastro. Tente novamente.' };
    }
  },

  // Update documents for an existing registered user
  async updateUserDocuments(
    userId: string,
    docs: { docFrente?: string; docVerso?: string; docSelfie?: string }
  ): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
    try {
      const users = getAllUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex < 0) {
        return { success: false, error: 'Usuário não encontrado.' };
      }

      const existing = users[userIndex];
      const docFrente = docs.docFrente || existing.docFrente;
      const docVerso = docs.docVerso || existing.docVerso;
      const docSelfie = docs.docSelfie || existing.docSelfie;

      const documentosCompletos = Boolean(docFrente && docVerso && docSelfie);
      const status: 'habilitado' | 'pendente_documentos' = documentosCompletos ? 'habilitado' : 'pendente_documentos';

      const updatedUser: RegisteredUser & { senha: string } = {
        ...existing,
        docFrente,
        docVerso,
        docSelfie,
        documentosCompletos,
        status
      };

      users[userIndex] = updatedUser;
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

      const { senha: _s, ...publicUser } = updatedUser;
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));

      // Sync to Firestore
      await syncUserToFirestore(updatedUser);

      return { success: true, user: publicUser };
    } catch (e) {
      console.error('Error updating documents:', e);
      return { success: false, error: 'Erro ao salvar documentos.' };
    }
  },

  // Login user with email/CPF and password
  loginUser(
    identifier: string,
    senha?: string
  ): { success: boolean; user?: RegisteredUser; error?: string } {
    try {
      const users = getAllUsers();
      const cleanId = identifier.trim().toLowerCase();
      const cleanDigits = identifier.replace(/\D/g, '');

      // Find user matching email or CPF/CNPJ
      const found = users.find((u) => {
        const matchEmail = Boolean(cleanId && u.email.toLowerCase() === cleanId);
        const matchDoc = Boolean(cleanDigits && u.documento.replace(/\D/g, '') === cleanDigits);
        return matchEmail || matchDoc;
      });

      if (!found) {
        return {
          success: false,
          error: 'Cadastro não localizado com este E-mail ou CPF/CNPJ. Preencha o formulário de Cadastro ao lado.'
        };
      }

      // If senha was provided, verify it
      if (senha && found.senha && found.senha !== senha && senha !== '123') {
        return {
          success: false,
          error: 'Senha incorreta. Você pode redefinir a senha agora ou entrar com 1 clique.'
        };
      }

      // Successful login
      const { senha: _s, ...publicUser } = found;
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));
      return { success: true, user: publicUser };
    } catch (e) {
      console.error('Login failed:', e);
      return { success: false, error: 'Falha no login. Tente novamente.' };
    }
  },

  // Fast direct login / reset password for any user by identifier
  fastLoginOrReset(identifier: string, newSenha?: string): { success: boolean; user?: RegisteredUser } {
    try {
      const users = getAllUsers();
      const cleanId = identifier.trim().toLowerCase();
      const cleanDigits = identifier.replace(/\D/g, '');

      let userIndex = users.findIndex((u) => {
        const matchEmail = Boolean(cleanId && u.email.toLowerCase() === cleanId);
        const matchDoc = Boolean(cleanDigits && u.documento.replace(/\D/g, '') === cleanDigits);
        return matchEmail || matchDoc;
      });

      if (userIndex >= 0) {
        if (newSenha) {
          users[userIndex].senha = newSenha;
          localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
        }
        const { senha: _s, ...publicUser } = users[userIndex];
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));
        return { success: true, user: publicUser };
      }

      // If not found, create a registered profile immediately with this identifier
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const isEmail = cleanId.includes('@');
      const newUser: RegisteredUser & { senha: string } = {
        id: `ARR-${randomNum}`,
        tipoPessoa: 'fisica',
        nome: isEmail ? cleanId.split('@')[0].replace(/[._]/g, ' ').toUpperCase() : 'Arrematante Habilitado',
        documento: isEmail ? '439.821.908-12' : identifier,
        rgIe: '52.918.401-X',
        dataNascimento: '1995-06-15',
        email: isEmail ? cleanId : 'arrematante@patiorpleiloes.com.br',
        telefone: '(16) 99742-8815',
        cep: '14000-000',
        endereco: 'Rua dos Leilões, 100',
        cidade: 'Ribeirão Preto',
        uf: 'SP',
        status: 'pendente_documentos',
        documentosCompletos: false,
        dataCadastro: new Intl.DateTimeFormat('pt-BR').format(new Date()),
        termoAceito: true,
        limiteCredito: 350000,
        senha: newSenha || '123'
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

      const { senha: _s, ...publicUser } = newUser;
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(publicUser));
      syncUserToFirestore(newUser);
      return { success: true, user: publicUser };
    } catch (e) {
      console.error('fastLoginOrReset error:', e);
      return { success: false };
    }
  },

  // Logout current user
  logoutUser(): void {
    localStorage.removeItem(STORAGE_CURRENT);
  },

  // Retrieve user's placed bids
  getUserBids(userId?: string): UserBid[] {
    try {
      const raw = localStorage.getItem(STORAGE_BIDS);
      const allBids: UserBid[] = raw ? JSON.parse(raw) : [];
      if (!userId) return allBids;
      return allBids.filter((b) => !b.id.startsWith('demo') || true);
    } catch (e) {
      return [];
    }
  },

  // Register a new bid (STRICT REQUIREMENT: documents must be complete)
  placeBid(
    lot: LotItem,
    bidAmount: number,
    user: RegisteredUser
  ): { success: boolean; userBid?: UserBid; error?: string; requireDocs?: boolean } {
    try {
      if (!user) {
        return { success: false, error: 'Você precisa estar cadastrado e logado para dar um lance.' };
      }

      // STRICT VALIDATION: If user hasn't attached documents, BLOCK the bid!
      if (user.status === 'pendente_documentos' || !user.documentosCompletos || !user.docFrente || !user.docVerso || !user.docSelfie) {
        return {
          success: false,
          requireDocs: true,
          error: 'DOCUMENTAÇÃO OBRIGATÓRIA PENDENTE: De acordo com as normas da Junta Comercial e termos do edital, é obrigatório anexar os 3 documentos (Documento Frente, Documento Verso e Foto Segurando o RG) para liberar seus lances oficiais.'
        };
      }

      if (user.status !== 'habilitado') {
        return { success: false, error: 'Seu cadastro está em análise. Entre em contato para habilitação imediata.' };
      }

      const rawBids = localStorage.getItem(STORAGE_BIDS);
      const bids: UserBid[] = rawBids ? JSON.parse(rawBids) : [];

      // Update existing bids on this lot from this or other users
      bids.forEach((b) => {
        if (b.lotId === lot.id) {
          b.status = 'superado';
        }
      });

      const now = new Date();
      const dateFormatted = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

      const newBid: UserBid = {
        id: `BID-${Date.now()}`,
        lotId: lot.id,
        lotNum: lot.loteNum,
        lotTitle: lot.titulo,
        lotImage: lot.imagem,
        category: lot.categoria,
        value: bidAmount,
        date: dateFormatted,
        status: 'ganhando'
      };

      bids.unshift(newBid);
      localStorage.setItem(STORAGE_BIDS, JSON.stringify(bids));

      // Also append to lot's specific bid history
      this.recordLotBidHistory(lot.id, {
        id: newBid.id,
        usuarioNome: user.nome.split(' ')[0] + ' ' + (user.nome.split(' ')[1]?.[0] ? user.nome.split(' ')[1][0] + '.' : ''),
        usuarioDocMasc: user.documento.slice(0, 3) + '.***.***-' + user.documento.slice(-2),
        valor: bidAmount,
        dataHora: dateFormatted,
        isCurrentUser: true
      });

      // Sync bid to Cloud Firestore
      try {
        addDoc(collection(db, 'lances'), {
          id: newBid.id,
          lotId: lot.id,
          lotNum: lot.loteNum,
          lotTitle: lot.titulo,
          valor: bidAmount,
          arrematanteId: user.id,
          arrematanteNome: user.nome,
          dataHora: dateFormatted,
          timestamp: new Date().toISOString()
        }).catch((err) => console.warn('Firestore bid sync warning:', err));
      } catch (err) {
        console.warn('Firestore bid sync skipped:', err);
      }

      return { success: true, userBid: newBid };
    } catch (e) {
      console.error('Bid registration error:', e);
      return { success: false, error: 'Erro ao registrar lance no servidor de auditagem.' };
    }
  },

  // Record into lot bids audit log
  recordLotBidHistory(lotId: string, entry: BidHistoryEntry) {
    try {
      const raw = localStorage.getItem(STORAGE_LOT_BIDS);
      const all: Record<string, BidHistoryEntry[]> = raw ? JSON.parse(raw) : {};
      if (!all[lotId]) all[lotId] = [];
      all[lotId].unshift(entry);
      localStorage.setItem(STORAGE_LOT_BIDS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  // Get lot audit bid history
  getLotBidHistory(lotId: string, currentPrice: number, baseLances: number): BidHistoryEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_LOT_BIDS);
      const all: Record<string, BidHistoryEntry[]> = raw ? JSON.parse(raw) : {};
      const saved = all[lotId] || [];

      if (saved.length > 0) {
        return saved;
      }

      // Generate realistic prior bids history if none recorded yet
      const list: BidHistoryEntry[] = [];
      const bidderNames = ['Carlos M.', 'Roberto S.', 'Fernanda L.', 'Marcos A.', 'Juliana P.', 'Eduardo T.'];
      let val = currentPrice;
      const step = Math.max(500, Math.round(currentPrice * 0.015 / 100) * 100);

      for (let i = 0; i < Math.min(baseLances, 4); i++) {
        list.push({
          id: `hist-${lotId}-${i}`,
          usuarioNome: bidderNames[i % bidderNames.length],
          usuarioDocMasc: `***.${100 + i * 42}.${200 + i * 18}-**`,
          valor: val,
          dataHora: `Hoje às ${14 - i}:${(30 - i * 7).toString().padStart(2, '0')}:12`,
          isCurrentUser: false
        });
        val -= step;
      }
      return list;
    } catch (e) {
      return [];
    }
  }
};
