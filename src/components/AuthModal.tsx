import React, { useState } from 'react';
import { RegisteredUser } from '../types';
import { authService } from '../services/authService';
import { processDocumentImage } from '../utils/imageCompressor';
import { WhatsAppDocCard } from './WhatsAppDocCard';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  bidIntentMessage?: string;
  onClose: () => void;
  onSuccess: (user: RegisteredUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  bidIntentMessage,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
  
  // Registration fields
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [rgIe, setRgIe] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [termoAceito, setTermoAceito] = useState(true);

  // Document attachments
  const [docFrente, setDocFrente] = useState('');
  const [docVerso, setDocVerso] = useState('');
  const [docSelfie, setDocSelfie] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Login fields
  const [loginId, setLoginId] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Status & validation feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [isAccountUpdated, setIsAccountUpdated] = useState(false);
  const [successUser, setSuccessUser] = useState<RegisteredUser | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'frente' | 'verso' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingField(field);
      setErrorMsg(null);
      const compressed = await processDocumentImage(file, 1200, 0.78);
      if (field === 'frente') setDocFrente(compressed);
      if (field === 'verso') setDocVerso(compressed);
      if (field === 'selfie') setDocSelfie(compressed);
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro ao processar imagem. Tente outro arquivo JPG ou PNG.');
    } finally {
      setUploadingField(null);
    }
  };

  const switchToMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMsg(null);
    setResetNotice(null);
    if (newMode === 'login') {
      if (email && !loginId) setLoginId(email);
      else if (documento && !loginId) setLoginId(documento);
    } else {
      if (loginId && !email && loginId.includes('@')) setEmail(loginId);
      else if (loginId && !documento && !loginId.includes('@')) handleDocChange(loginId);
    }
  };

  // Masks
  const handleDocChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (tipoPessoa === 'fisica') {
      // CPF: 000.000.000-00
      let formatted = digits;
      if (digits.length > 3) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
      if (digits.length > 6) formatted = `${formatted.slice(0, 7)}.${digits.slice(6)}`;
      if (digits.length > 9) formatted = `${formatted.slice(0, 11)}-${digits.slice(9, 11)}`;
      setDocumento(formatted.slice(0, 14));
    } else {
      // CNPJ: 00.000.000/0000-00
      let formatted = digits;
      if (digits.length > 2) formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      if (digits.length > 5) formatted = `${formatted.slice(0, 6)}.${digits.slice(5)}`;
      if (digits.length > 8) formatted = `${formatted.slice(0, 10)}/${digits.slice(8)}`;
      if (digits.length > 12) formatted = `${formatted.slice(0, 15)}-${digits.slice(12, 14)}`;
      setDocumento(formatted.slice(0, 18));
    }
  };

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 0) formatted = `(${digits.slice(0, 2)}`;
    if (digits.length > 2) formatted = `${formatted}) ${digits.slice(2, 7)}`;
    if (digits.length > 7) formatted = `${formatted}-${digits.slice(7, 11)}`;
    setTelefone(formatted.slice(0, 15));
  };

  const handleCepChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 5) formatted = `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
    setCep(formatted.slice(0, 9));

    // Simple mockup CEP autocomplete
    if (digits.length === 8) {
      if (digits.startsWith('01') || digits.startsWith('02') || digits.startsWith('03')) {
        setCidade('São Paulo');
        setUf('SP');
      } else if (digits.startsWith('20') || digits.startsWith('21')) {
        setCidade('Rio de Janeiro');
        setUf('RJ');
      } else if (digits.startsWith('30') || digits.startsWith('31')) {
        setCidade('Belo Horizonte');
        setUf('MG');
      } else if (digits.startsWith('68')) {
        setCidade('Castanhal');
        setUf('PA');
      } else if (digits.startsWith('89')) {
        setCidade('Rio do Sul');
        setUf('SC');
      }
    }
  };

  // Submit Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (senha.length < 4) {
      setErrorMsg('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    if (senha !== confirmSenha) {
      setErrorMsg('A confirmação de senha não confere.');
      return;
    }

    const cleanDoc = documento.replace(/\D/g, '');
    if (tipoPessoa === 'fisica' && cleanDoc.length !== 11) {
      setErrorMsg('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }
    if (tipoPessoa === 'juridica' && cleanDoc.length !== 14) {
      setErrorMsg('Por favor, informe um CNPJ válido com 14 dígitos.');
      return;
    }

    if (!termoAceito) {
      setErrorMsg('Você precisa aceitar os Termos e Condições do Leilão para se habilitar.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = authService.registerUser({
        tipoPessoa,
        nome,
        documento,
        email,
        telefone,
        cep: cep || '01000-000',
        endereco,
        cidade: cidade || 'São Paulo',
        uf: uf || 'SP',
        rgIe,
        dataNascimento: dataNasc,
        docFrente,
        docVerso,
        docSelfie,
        senha
      });

      setLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Erro ao efetuar cadastro.');
      } else {
        setIsAccountUpdated(Boolean(res.isUpdate));
        setSuccessUser(res.user);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1600);
      }
    }, 400);
  };

  // Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetNotice(null);
    setLoading(true);

    setTimeout(() => {
      const res = authService.loginUser(loginId, loginSenha);
      setLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Credenciais inválidas.');
      } else {
        setSuccessUser(res.user);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1200);
      }
    }, 400);
  };

  // Quick 1-click direct login
  const handleQuickDemo = () => {
    setLoading(true);
    setErrorMsg(null);
    setResetNotice(null);
    const target = loginId.trim() || email.trim() || 'brennogomes2003@gmail.com';
    const res = authService.fastLoginOrReset(target);
    setLoading(false);
    if (res.success && res.user) {
      setSuccessUser(res.user);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 1000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#0b2c4d',
            color: '#ffffff'
          }}
        >
          <button
            type="button"
            onClick={() => switchToMode('login')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              fontWeight: 800,
              color: mode === 'login' ? '#0b2c4d' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              borderTopLeftRadius: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🔑</span> Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => switchToMode('register')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              fontWeight: 800,
              color: mode === 'register' ? '#0b2c4d' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📝</span> Cadastro de Arrematante
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              padding: '0 20px',
              cursor: 'pointer',
              opacity: 0.8
            }}
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Banner de Intenção de Lance */}
        {bidIntentMessage && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              borderBottom: '1px solid #fde68a',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: '#92400e',
              fontWeight: 600
            }}
          >
            <span style={{ fontSize: '18px' }}>⚖️</span>
            <div>{bidIntentMessage}</div>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Sucesso state */}
          {successUser ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b2c4d', margin: '0 0 8px' }}>
                {mode === 'login'
                  ? 'Bem-vindo de volta!'
                  : isAccountUpdated
                  ? 'Cadastro Atualizado e Confirmado!'
                  : 'Cadastro Realizado com Sucesso!'}
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 10px' }}>
                Arrematante: <strong>{successUser.nome}</strong> ({successUser.id})
              </p>
              {isAccountUpdated && (
                <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 700, marginBottom: '12px' }}>
                  ✓ Cadastro e nova senha validados com sucesso.
                </div>
              )}
              {successUser.status === 'pendente_documentos' || !successUser.documentosCompletos ? (
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    maxWidth: '420px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 800 }}>
                    <span>⚠️</span> DOCUMENTOS PENDENTES DE ENVIO
                  </div>
                  <span style={{ fontSize: '11px', color: '#78350f', fontWeight: 500, textAlign: 'center' }}>
                    Seus dados foram salvos! Para liberar seus lances oficiais, envie os 3 documentos (frente, verso e foto com RG).
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  <span>✓</span> DOCUMENTOS APROVADOS - HABILITADO PARA LANCES
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
                Redirecionando para o lote...
              </p>
            </div>
          ) : (
            <>
              {/* Avisos de Redefinição */}
              {resetNotice && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#166534',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>✓</span> {resetNotice}
                </div>
              )}

              {/* Error feedback */}
              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#991b1b',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <span>⚠️</span> <span>{errorMsg}</span>
                  </div>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={handleQuickDemo}
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#0b2c4d',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ Entrar com 1 Clique (Acesso Rápido)
                    </button>
                  )}
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' ? (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      E-mail ou CPF/CNPJ
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Digite seu e-mail ou documento"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                        Senha de Acesso
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const target = loginId.trim() || email.trim() || 'brennogomes2003@gmail.com';
                          authService.fastLoginOrReset(target, '123');
                          setLoginSenha('123');
                          setResetNotice('Sua senha foi redefinida temporariamente para: 123. Você pode clicar em "Entrar" agora ou usar o Acesso Rápido abaixo.');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          color: '#B8874C',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: '#B8874C',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '15px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {loading ? 'Validando...' : 'Entrar e Habilitar Lances'}
                  </button>

                  {/* Fast direct access button */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                      Ou acesse de forma instantânea com 1 clique:
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickDemo}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0b2c4d',
                        borderRadius: '8px',
                        padding: '11px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>⚡</span> Entrar Imediatamente com 1 Clique (Acesso Direto)
                    </button>
                  </div>

                  <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                    Ainda não possui cadastro?{' '}
                    <button
                      type="button"
                      onClick={() => switchToMode('register')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B8874C',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Cadastre-se gratuitamente
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister}>
                  {/* Tip banner for existing accounts */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}
                  >
                    <span>Já possui cadastro anterior ou quer apenas entrar?</span>
                    <button
                      type="button"
                      onClick={() => switchToMode('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0b2c4d',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0
                      }}
                    >
                      Acessar Conta →
                    </button>
                  </div>

                  {/* Tipo de Pessoa Toggle */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setTipoPessoa('fisica');
                        setDocumento('');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: tipoPessoa === 'fisica' ? '#B8874C' : '#e2e8f0',
                        backgroundColor: tipoPessoa === 'fisica' ? '#fffbeb' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: tipoPessoa === 'fisica' ? '#B8874C' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      👤 Pessoa Física (CPF)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTipoPessoa('juridica');
                        setDocumento('');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: tipoPessoa === 'juridica' ? '#B8874C' : '#e2e8f0',
                        backgroundColor: tipoPessoa === 'juridica' ? '#fffbeb' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: tipoPessoa === 'juridica' ? '#B8874C' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      🏢 Pessoa Jurídica (CNPJ)
                    </button>
                  </div>

                  {/* Nome Completo / Razao Social */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {tipoPessoa === 'fisica' ? 'Nome Completo (Conforme Documento)' : 'Razão Social'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={tipoPessoa === 'fisica' ? 'Ex: Carlos Alberto Santos' : 'Ex: Santos Transportes Ltda'}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* CPF/CNPJ & RG/IE */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        {tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={tipoPessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                        value={documento}
                        onChange={(e) => handleDocChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        {tipoPessoa === 'fisica' ? 'RG / CNH' : 'Inscrição Estadual'}
                      </label>
                      <input
                        type="text"
                        placeholder={tipoPessoa === 'fisica' ? 'Ex: 12.345.678-9' : 'Ex: Isento ou Número'}
                        value={rgIe}
                        onChange={(e) => setRgIe(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Telefone & E-mail */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Celular / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(00) 90000-0000"
                        value={telefone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={dataNasc}
                        onChange={(e) => setDataNasc(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      E-mail Oficial para Notificações de Arrematação *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Endereço: CEP, Cidade, UF */}
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        CEP *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        UF
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="SP"
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        style={{
                          width: '100%',
                          padding: '10px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>

                  {/* Senha e Confirmação */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Criar Senha *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 4 dígitos"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repita a senha"
                        value={confirmSenha}
                        onChange={(e) => setConfirmSenha(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* ANEXO DE DOCUMENTOS OBRIGATÓRIOS PARA LANCES */}
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      marginBottom: '18px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0b2c4d' }}>
                        Anexar Documentos para Homologação de Lances
                      </div>
                      {docFrente && docVerso && docSelfie ? (
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                          ✓ 3/3 Anexados
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '10px' }}>
                          {(docFrente ? 1 : 0) + (docVerso ? 1 : 0) + (docSelfie ? 1 : 0)}/3 Anexados
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: '#475569',
                        lineHeight: 1.4,
                        marginBottom: '14px',
                        backgroundColor: '#ffffff',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <strong style={{ color: '#b45309' }}>⚠️ Regra do Edital:</strong> Caso cadastre apenas os dados sem anexar os documentos agora, seu cadastro será salvo com sucesso, porém seus <strong>lances ficarão bloqueados</strong> até o envio da documentação completa.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Frente */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: docFrente ? '#f0fdf4' : '#ffffff',
                          border: docFrente ? '1px solid #86efac' : '1px dashed #cbd5e1',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {docFrente ? (
                            <img
                              src={docFrente}
                              alt="Frente"
                              referrerPolicy="no-referrer"
                              style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <span style={{ fontSize: '18px' }}>🪪</span>
                          )}
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                              1. Documento Frente (RG ou CNH)
                            </div>
                            <div style={{ fontSize: '10px', color: docFrente ? '#16a34a' : '#64748b' }}>
                              {docFrente ? 'Foto anexada' : 'Frente com foto e número'}
                            </div>
                          </div>
                        </div>
                        <label
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: docFrente ? '#e2e8f0' : '#0b2c4d',
                            color: docFrente ? '#334155' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          {uploadingField === 'frente' ? 'Carregando...' : docFrente ? 'Trocar Foto' : '+ Anexar Frente'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload(e, 'frente')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      {/* Verso */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: docVerso ? '#f0fdf4' : '#ffffff',
                          border: docVerso ? '1px solid #86efac' : '1px dashed #cbd5e1',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {docVerso ? (
                            <img
                              src={docVerso}
                              alt="Verso"
                              referrerPolicy="no-referrer"
                              style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <span style={{ fontSize: '18px' }}>🔄</span>
                          )}
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                              2. Documento Verso (RG ou CNH)
                            </div>
                            <div style={{ fontSize: '10px', color: docVerso ? '#16a34a' : '#64748b' }}>
                              {docVerso ? 'Foto anexada' : 'Verso com filiação e órgão'}
                            </div>
                          </div>
                        </div>
                        <label
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: docVerso ? '#e2e8f0' : '#0b2c4d',
                            color: docVerso ? '#334155' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          {uploadingField === 'verso' ? 'Carregando...' : docVerso ? 'Trocar Foto' : '+ Anexar Verso'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload(e, 'verso')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      {/* Selfie com RG */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: docSelfie ? '#f0fdf4' : '#ffffff',
                          border: docSelfie ? '1px solid #86efac' : '1px dashed #cbd5e1',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {docSelfie ? (
                            <img
                              src={docSelfie}
                              alt="Selfie"
                              referrerPolicy="no-referrer"
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          ) : (
                            <span style={{ fontSize: '18px' }}>🤳</span>
                          )}
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                              3. Foto Segurando o RG (Selfie)
                            </div>
                            <div style={{ fontSize: '10px', color: docSelfie ? '#16a34a' : '#64748b' }}>
                              {docSelfie ? 'Foto anexada' : 'Rosto visível junto ao documento'}
                            </div>
                          </div>
                        </div>
                        <label
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: docSelfie ? '#e2e8f0' : '#0b2c4d',
                            color: docSelfie ? '#334155' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          {uploadingField === 'selfie' ? 'Carregando...' : docSelfie ? 'Trocar Foto' : '+ Anexar Selfie'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload(e, 'selfie')}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* WhatsApp Alternative */}
                    <div style={{ marginTop: '14px' }}>
                      <WhatsAppDocCard
                        compact
                        user={{
                          nome,
                          documento,
                          email,
                          telefone
                        }}
                      />
                    </div>
                  </div>

                  {/* Termos de Uso e Habilitação */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '18px'
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '12px',
                        color: '#334155',
                        cursor: 'pointer',
                        lineHeight: '1.4'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={termoAceito}
                        onChange={(e) => setTermoAceito(e.target.checked)}
                        style={{ marginTop: '2px', cursor: 'pointer' }}
                      />
                      <span>
                        Declaro que li e concordo com os <strong>Termos do Leilão</strong>, 
                        o <strong>Edital Oficial</strong> e as <strong>Políticas de Privacidade</strong>, 
                        solicitando a imediata <strong>Habilitação para Lances Online</strong>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: docFrente && docVerso && docSelfie ? '#16a34a' : '#0b2c4d',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {loading
                      ? 'Processando e Salvando Cadastro...'
                      : docFrente && docVerso && docSelfie
                      ? '✓ Concluir Cadastro com Documentos e Liberar Lances'
                      : 'Concluir Cadastro (Lances Bloqueados até Enviar Documentos)'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
