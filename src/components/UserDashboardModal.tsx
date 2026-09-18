import React, { useState, useEffect } from 'react';
import { RegisteredUser, UserBid } from '../types';
import { authService } from '../services/authService';
import { DocumentosUploadModal } from './DocumentosUploadModal';
import { WhatsAppDocCard } from './WhatsAppDocCard';

interface UserDashboardModalProps {
  isOpen: boolean;
  user: RegisteredUser;
  onClose: () => void;
  onSelectLot: (lotId: string) => void;
  onLogout: () => void;
  onUserUpdated?: (updatedUser: RegisteredUser) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  user: initialUser,
  onClose,
  onSelectLot,
  onLogout,
  onUserUpdated
}) => {
  const [currentUser, setCurrentUser] = useState<RegisteredUser>(initialUser);
  const [bids, setBids] = useState<UserBid[]>([]);
  const [activeTab, setActiveTab] = useState<'lances' | 'dados'>('lances');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    if (!isOpen) return;
    setBids(authService.getUserBids(currentUser.id));
  }, [currentUser.id, isOpen]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleDocSuccess = (updatedUser: RegisteredUser) => {
    setCurrentUser(updatedUser);
    setIsDocModalOpen(false);
    if (onUserUpdated) {
      onUserUpdated(updatedUser);
    }
  };

  const isHabilitado = currentUser.status === 'habilitado' && currentUser.documentosCompletos;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#0b2c4d',
              color: '#ffffff',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#B8874C',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800
                }}
              >
                {currentUser.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>{currentUser.nome}</h3>
                  {isHabilitado ? (
                    <span
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      ✓ HABILITADO
                    </span>
                  ) : (
                    <span
                      style={{
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      ⚠️ DOCS PENDENTES
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                  ID Arrematante: <strong>{currentUser.id}</strong> • CPF/CNPJ: {currentUser.documento}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '22px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* Pending Documents Callout Banner */}
          {!isHabilitado && (
            <div
              style={{
                backgroundColor: '#fffbeb',
                borderBottom: '1px solid #fde68a',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
                    LANCES BLOQUEADOS: Documentação Pendente
                  </div>
                  <div style={{ fontSize: '11px', color: '#78350f' }}>
                    Anexe a Frente, Verso e Foto com RG para liberar seus lances imediatamente.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(true)}
                style={{
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Anexar Agora →
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              padding: '0 16px'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('lances')}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '13px',
                color: activeTab === 'lances' ? '#0b2c4d' : '#64748b',
                borderBottom: activeTab === 'lances' ? '3px solid #B8874C' : 'none',
                cursor: 'pointer'
              }}
            >
              🔨 Meus Lances ({bids.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dados')}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '13px',
                color: activeTab === 'dados' ? '#0b2c4d' : '#64748b',
                borderBottom: activeTab === 'dados' ? '3px solid #B8874C' : 'none',
                cursor: 'pointer'
              }}
            >
              📄 Dados & Documentos {isHabilitado ? '✓' : '⚠️'}
            </button>
          </div>

          {/* Content Body */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
            {activeTab === 'lances' ? (
              <div>
                {bids.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
                      Nenhum lance ofertado ainda
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto 16px' }}>
                      {isHabilitado
                        ? 'Seu cadastro está 100% ativo e habilitado! Navegue pelo catálogo e participe dos leilões em tempo real.'
                        : 'Atenção: seus documentos ainda não foram enviados. Conclua o envio para poder dar lances oficiais.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isHabilitado) {
                          setIsDocModalOpen(true);
                        } else {
                          onClose();
                        }
                      }}
                      style={{
                        backgroundColor: '#B8874C',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {!isHabilitado ? 'Anexar Documentos para Liberar Lances' : 'Ver Lotes Disponíveis'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bids.map((bid) => (
                      <div
                        key={bid.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: bid.status === 'ganhando' ? '#f0fdf4' : '#f8fafc'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={bid.lotImage}
                            alt={bid.lotTitle}
                            style={{
                              width: '60px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '6px'
                            }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  backgroundColor: '#0b2c4d',
                                  color: '#ffffff',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}
                              >
                                LOTE {bid.lotNum}
                              </span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: bid.status === 'ganhando' ? '#16a34a' : '#ea580c',
                                  backgroundColor: bid.status === 'ganhando' ? '#dcfce7' : '#ffedd5',
                                  padding: '2px 8px',
                                  borderRadius: '10px'
                                }}
                              >
                                {bid.status === 'ganhando' ? '✓ GANHANDO' : '⚡ LANCE SUPERADO'}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#1e293b',
                                marginTop: '4px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                onSelectLot(bid.lotId);
                                onClose();
                              }}
                            >
                              {bid.lotTitle}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              {bid.date}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0b2c4d' }}>
                            {formatCurrency(bid.value)}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectLot(bid.lotId);
                              onClose();
                            }}
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#B8874C',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              marginTop: '4px'
                            }}
                          >
                            Ver Lote →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#334155' }}>
                {/* Status de Homologação de Documentos */}
                <div
                  style={{
                    backgroundColor: isHabilitado ? '#f0fdf4' : '#fffbeb',
                    border: isHabilitado ? '1px solid #bbf7d0' : '1px solid #fde68a',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isHabilitado ? '#166534' : '#92400e', fontWeight: 800 }}>
                      <span>{isHabilitado ? '✓' : '⚠️'}</span>
                      {isHabilitado ? 'Documentação Completa & Homologada' : 'Documentos Obrigatórios Pendentes'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDocModalOpen(true)}
                      style={{
                        backgroundColor: isHabilitado ? '#0b2c4d' : '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isHabilitado ? 'Atualizar Documentos' : '+ Enviar Documentos Agora'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>🪪</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Doc. Frente</div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: currentUser.docFrente ? '#16a34a' : '#dc2626' }}>
                        {currentUser.docFrente ? '✓ Anexado' : '✕ Pendente'}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>🔄</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Doc. Verso</div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: currentUser.docVerso ? '#16a34a' : '#dc2626' }}>
                        {currentUser.docVerso ? '✓ Anexado' : '✕ Pendente'}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>🤳</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Selfie com RG</div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: currentUser.docSelfie ? '#16a34a' : '#dc2626' }}>
                        {currentUser.docSelfie ? '✓ Anexada' : '✕ Pendente'}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: isHabilitado ? '#15803d' : '#78350f', marginTop: '10px' }}>
                    {isHabilitado
                      ? 'Seus lances estão totalmente liberados no sistema.'
                      : 'Caso não envie os 3 documentos acima, você não conseguirá dar lances nos lotes.'}
                  </div>

                  {/* WhatsApp Submission Card */}
                  {!isHabilitado && (
                    <div style={{ marginTop: '14px' }}>
                      <WhatsAppDocCard
                        compact
                        user={{
                          nome: currentUser.nome,
                          documento: currentUser.documento,
                          email: currentUser.email,
                          id: currentUser.id,
                          telefone: currentUser.telefone
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Dados Cadastrais */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0b2c4d', margin: '0 0 12px' }}>
                    Identificação do Arrematante
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Nome/Razão:</span>{' '}
                      <strong>{currentUser.nome}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Tipo:</span>{' '}
                      <strong>{currentUser.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Documento:</span>{' '}
                      <strong>{currentUser.documento}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>E-mail:</span>{' '}
                      <strong>{currentUser.email}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Telefone:</span>{' '}
                      <strong>{currentUser.telefone}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Cidade/UF:</span>{' '}
                      <strong>{currentUser.cidade} - {currentUser.uf}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Desconectar da Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      {isDocModalOpen && (
        <DocumentosUploadModal
          isOpen={isDocModalOpen}
          user={currentUser}
          onClose={() => setIsDocModalOpen(false)}
          onSuccess={handleDocSuccess}
        />
      )}
    </>
  );
};

