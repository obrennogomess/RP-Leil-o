import React, { useState, useEffect } from 'react';
import { LotItem, RegisteredUser, BidHistoryEntry } from '../types';
import { authService } from '../services/authService';
import { DocumentosUploadModal } from './DocumentosUploadModal';
import { getWhatsAppDocsUrl, WHATSAPP_DOCS_FORMATTED } from '../utils/whatsappDocs';

interface LotDetailModalProps {
  lot: LotItem | null;
  currentUser: RegisteredUser | null;
  onClose: () => void;
  onPlaceBid: (lotId: string, newBid: number) => void;
  onOpenAuth: (mode?: 'login' | 'register', reason?: string) => void;
  onUserUpdated?: (updatedUser: RegisteredUser) => void;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  currentUser,
  onClose,
  onPlaceBid,
  onOpenAuth,
  onUserUpdated
}) => {
  const [bidSuccess, setBidSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'documentos' | 'condicoes' | 'historico'>('detalhes');
  const [bidHistory, setBidHistory] = useState<BidHistoryEntry[]>([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  
  // Custom bid states
  const nextBid = lot ? lot.valorAtualNum + lot.incrementoMinimo : 0;
  const [chosenBid, setChosenBid] = useState<number>(nextBid);
  const [customBidInput, setCustomBidInput] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);

  useEffect(() => {
    if (!lot) return;
    setChosenBid(lot.valorAtualNum + lot.incrementoMinimo);
    setBidHistory(authService.getLotBidHistory(lot.id, lot.valorAtualNum, lot.lances));
  }, [lot?.id, lot?.valorAtualNum, lot?.lances]);

  if (!lot) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleQuickAdd = (amount: number) => {
    const newVal = chosenBid + amount;
    setChosenBid(newVal);
    setCustomBidInput('');
    setBidError(null);
  };

  const handleCustomBidChange = (valStr: string) => {
    setCustomBidInput(valStr);
    const digits = valStr.replace(/\D/g, '');
    const num = Number(digits) / 100;
    if (num >= nextBid) {
      setChosenBid(num);
      setBidError(null);
    } else {
      setChosenBid(nextBid);
    }
  };

  const isUserDocsComplete = Boolean(
    currentUser &&
    currentUser.status === 'habilitado' &&
    currentUser.documentosCompletos &&
    currentUser.docFrente &&
    currentUser.docVerso &&
    currentUser.docSelfie
  );

  const handleOpenBidConfirm = (amount: number) => {
    if (!currentUser) {
      onOpenAuth('register', `Para ofertar lances no Lote ${lot.loteNum} (${lot.titulo}), é necessário criar seu cadastro oficial de arrematante.`);
      return;
    }

    // STRICT CHECK: User only filled data but hasn't uploaded documents!
    if (!isUserDocsComplete) {
      setBidError('DOCUMENTOS OBRIGATÓRIOS PENDENTES: De acordo com o edital oficial, para dar lances é obrigatório anexar os 3 documentos (frente, verso e selfie segurando o RG).');
      setIsDocModalOpen(true);
      return;
    }

    if (amount < nextBid) {
      setBidError(`O valor mínimo para o próximo lance é ${formatCurrency(nextBid)}.`);
      return;
    }

    setChosenBid(amount);
    setShowConfirmModal(true);
  };

  const handleConfirmBidExecution = () => {
    if (!currentUser) return;

    const res = authService.placeBid(lot, chosenBid, currentUser);
    if (res.success) {
      onPlaceBid(lot.id, chosenBid);
      setShowConfirmModal(false);
      setBidSuccess(true);
      setBidHistory(authService.getLotBidHistory(lot.id, chosenBid, lot.lances + 1));
      setTimeout(() => setBidSuccess(false), 4000);
    } else {
      setBidError(res.error || 'Erro ao processar lance.');
      setShowConfirmModal(false);
    }
  };

  const isImovel =
    lot.categoria === 'imoveis' ||
    (lot.subcategoria || '').toLowerCase().includes('imóv') ||
    (lot.subcategoria || '').toLowerCase().includes('imov') ||
    (lot.leilaoNome || '').toLowerCase().includes('imóv') ||
    (lot.leilaoNome || '').toLowerCase().includes('imov') ||
    Boolean(lot.tipoImovel);

  const isMaterial =
    lot.categoria === 'materiais' ||
    lot.categoria === 'equipamentos' ||
    (lot.subcategoria || '').toLowerCase().includes('materiais') ||
    (lot.subcategoria || '').toLowerCase().includes('material') ||
    (lot.leilaoNome || '').toLowerCase().includes('materiais') ||
    Boolean(lot.condicaoMaterial);

  const diffFipe = lot.fipeNum ? lot.fipeNum - lot.valorAtualNum : 0;
  const pctFipe = lot.fipeNum ? Math.round((diffFipe / lot.fipeNum) * 100) : 0;

  const diffAvaliacao = lot.valorAvaliacaoNum ? lot.valorAvaliacaoNum - lot.valorAtualNum : 0;
  const pctAvaliacao = lot.valorAvaliacaoNum ? Math.round((diffAvaliacao / lot.valorAvaliacaoNum) * 100) : 0;

  return (
    <>
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
            background: '#fff',
            borderRadius: '14px',
            maxWidth: '860px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0b2c4d',
              color: '#ffffff',
              borderTopLeftRadius: '14px',
              borderTopRightRadius: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  background: '#B8874C',
                  color: '#fff',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}
              >
                LOTE {lot.loteNum}
              </span>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {lot.leilaoNome}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 0,
                fontSize: '22px',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
              title="Fechar Detalhes"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Left: Image & Quick Stats */}
              <div>
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={lot.imagem}
                    alt={lot.titulo}
                    style={{ width: '100%', height: '270px', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: lot.status === 'Aberto para Lances' ? '#16a34a' : '#0b2c4d',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    ● {lot.status}
                  </div>
                </div>

                {/* Counter Badges */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '12px',
                    padding: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#4b5563'
                  }}
                >
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveTab('historico')}
                    title="Ver histórico de lances"
                  >
                    <i className="fa-solid fa-gavel" style={{ color: '#B8874C', marginRight: '6px' }}></i>
                    <strong>{lot.lances}</strong> lances
                  </div>
                  <div>
                    <i className="fa-regular fa-eye" style={{ color: '#B8874C', marginRight: '6px' }}></i>
                    <strong>{lot.visualizacoes}</strong> visitas
                  </div>
                  {isImovel ? (
                    <div>
                      <i className="fa-solid fa-ruler-combined" style={{ color: '#B8874C', marginRight: '6px' }}></i>
                      {lot.areaTotal || 'Área total'}
                    </div>
                  ) : isMaterial ? (
                    <div>
                      <i className="fa-solid fa-boxes-stacked" style={{ color: '#B8874C', marginRight: '6px' }}></i>
                      {lot.quantidade ? 'Lote de Itens' : 'Lote Único'}
                    </div>
                  ) : (
                    <div>
                      <i className="fa-regular fa-clock" style={{ color: '#B8874C', marginRight: '6px' }}></i>
                      {lot.anoModelo || 'Ano/Modelo'}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Bidding & Information */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0b2c4d', margin: 0 }}>{lot.titulo}</h2>
                
                {/* Subtitle / metadata */}
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                  {isImovel ? (
                    <>
                      📍 <strong>{lot.cidade ? `${lot.cidade} - ${lot.uf}` : 'Brasil'}</strong> • Tipo: <strong>{lot.tipoImovel || 'Imóvel'}</strong> • Origem: <strong>{lot.origem}</strong>
                    </>
                  ) : isMaterial ? (
                    <>
                      📦 <strong>{lot.quantidade || 'Lote de Materiais'}</strong> • Origem: <strong>{lot.origem}</strong>
                    </>
                  ) : (
                    <>
                      {lot.placaMascarada && lot.placaMascarada !== '---' && (
                        <>Placa mascarada: <strong>{lot.placaMascarada}</strong> • </>
                      )}
                      Origem: <strong>{lot.origem}</strong>
                    </>
                  )}
                </div>

                {/* Assessment / FIPE comparison box */}
                {isImovel && (lot.valorAvaliacao || lot.valorAvaliacaoNum) ? (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginTop: '12px',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                      <span>Laudo de Avaliação Homologado:</span>
                      <strong>{lot.valorAvaliacao || formatCurrency(lot.valorAvaliacaoNum || 0)}</strong>
                    </div>
                    <div style={{ color: '#15803d', fontWeight: 700, fontSize: '12px', marginTop: '4px' }}>
                      {pctAvaliacao > 0
                        ? `Economia estimada de ${formatCurrency(diffAvaliacao)} (${pctAvaliacao}% abaixo da avaliação)`
                        : (lot.abaixoFipe || 'Excelente oportunidade abaixo do valor de mercado')}
                    </div>
                  </div>
                ) : lot.fipeNum && lot.fipeNum > 0 ? (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginTop: '12px',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                      <span>Tabela FIPE oficial:</span>
                      <strong>{lot.fipe}</strong>
                    </div>
                    {pctFipe > 0 && (
                      <div style={{ color: '#15803d', fontWeight: 700, fontSize: '12px', marginTop: '4px' }}>
                        Economia estimada de {formatCurrency(diffFipe)} ({pctFipe}% abaixo da FIPE)
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Price card */}
                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginTop: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                      Lance Atual
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Incremento mín: {formatCurrency(lot.incrementoMinimo)}
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#0b2c4d', margin: '4px 0' }}>
                    {lot.valorAtual}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    Próxima oferta mínima: <strong>{formatCurrency(nextBid)}</strong>
                  </div>
                </div>

                {/* Error alert */}
                {bidError && (
                  <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '10px' }}>
                    ⚠️ {bidError}
                  </div>
                )}

                {/* Bidding Actions / Registration Guard */}
                <div style={{ marginTop: '14px' }}>
                  {bidSuccess ? (
                    <div
                      style={{
                        background: '#16a34a',
                        color: '#fff',
                        padding: '14px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}
                    >
                      ✓ Parabéns! Seu lance de {formatCurrency(chosenBid)} foi registrado com sucesso!
                    </div>
                  ) : !currentUser ? (
                    /* User NOT Logged In - Enforce Registration */
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0b2c4d', fontWeight: 700, fontSize: '13px' }}>
                        <i className="fa-solid fa-lock" style={{ color: '#B8874C' }}></i>
                        <span>Cadastro Obrigatório para Dar Lances</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 12px', lineHeight: '1.4' }}>
                        Por determinação legal, para ofertar lances em leilões oficiais você deve possuir cadastro homologado com CPF ou CNPJ.
                      </p>
                      
                      <button
                        type="button"
                        onClick={() => onOpenAuth('register', `Cadastre-se para habilitar lances no Lote ${lot.loteNum} (${lot.titulo})`)}
                        style={{
                          width: '100%',
                          padding: '13px',
                          backgroundColor: '#B8874C',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '14px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <i className="fa-solid fa-user-plus"></i>
                        Cadastre-se para Dar Lance
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => onOpenAuth('login', `Acesse sua conta para ofertar lance no Lote ${lot.loteNum}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0b2c4d',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Já é cadastrado? Acessar Conta
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* User IS Logged In - Authorized Bidding Console */
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '14px'
                      }}
                    >
                      {/* Bidder Badge */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                          paddingBottom: '10px',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: isUserDocsComplete ? '#16a34a' : '#d97706', fontWeight: 800 }}>●</span>
                          <span style={{ fontSize: '12px', color: '#1e293b' }}>
                            Arrematante: <strong>{currentUser.nome}</strong>
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            backgroundColor: isUserDocsComplete ? '#dcfce7' : '#fef3c7',
                            color: isUserDocsComplete ? '#15803d' : '#92400e',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          {isUserDocsComplete ? 'HABILITADO' : 'DOCS PENDENTES'}
                        </span>
                      </div>

                      {/* Pending Documents Warning Banner if not completed */}
                      {!isUserDocsComplete && (
                        <div
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            marginBottom: '12px'
                          }}
                        >
                          <div style={{ color: '#92400e', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>⚠️</span> Lances Bloqueados: Documentos Pendentes
                          </div>
                          <p style={{ fontSize: '11px', color: '#78350f', margin: '4px 0 8px', lineHeight: 1.4 }}>
                            Conforme o edital oficial, para conseguir dar lances você deve anexar os 3 documentos: frente, verso e foto segurando o RG.
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setIsDocModalOpen(true)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: '#d97706',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <i className="fa-solid fa-id-card"></i>
                              Anexar Documentos no Site
                            </button>

                            <a
                              href={getWhatsAppDocsUrl(currentUser)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                textDecoration: 'none',
                                boxSizing: 'border-box'
                              }}
                            >
                              <i className="fa-brands fa-whatsapp"></i>
                              Enviar pelo WhatsApp {WHATSAPP_DOCS_FORMATTED}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Quick Increment Chips */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
                          INCREMENTAR VALOR:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {[500, 1000, 2000, 5000].map((incr) => (
                            <button
                              key={incr}
                              type="button"
                              onClick={() => handleQuickAdd(incr)}
                              style={{
                                padding: '6px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#0b2c4d',
                                cursor: 'pointer'
                              }}
                            >
                              +{formatCurrency(incr)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Place Bid CTA or Lock CTA */}
                      {!isUserDocsComplete ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBidError('LANCES BLOQUEADOS: Anexe o documento frente e verso e a foto segurando o RG para liberar seus lances.');
                            setIsDocModalOpen(true);
                          }}
                          style={{
                            width: '100%',
                            backgroundColor: '#d97706',
                            color: '#ffffff',
                            padding: '14px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <i className="fa-solid fa-lock"></i>
                          Liberar Lances (Anexar Documentos)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBidConfirm(chosenBid)}
                          disabled={lot.status === 'Encerrado'}
                          style={{
                            width: '100%',
                            backgroundColor: lot.status === 'Encerrado' ? '#9ca3af' : '#16a34a',
                            color: '#ffffff',
                            padding: '14px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '15px',
                            border: 'none',
                            cursor: lot.status === 'Encerrado' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <i className="fa-solid fa-gavel"></i>
                          {lot.status === 'Encerrado' ? 'Lote Encerrado' : `Confirmar Lance de ${formatCurrency(chosenBid)}`}
                        </button>
                      )}

                      <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '8px' }}>
                        Oferta vinculante regida pelas regras do edital oficial.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Tabs */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', overflowX: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('detalhes')}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === 'detalhes' ? '#0b2c4d' : '#f3f4f6',
                    color: activeTab === 'detalhes' ? '#fff' : '#374151',
                    borderRadius: '6px',
                    border: 0,
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isImovel ? 'Ficha do Imóvel' : isMaterial ? 'Ficha do Lote' : 'Ficha Técnica'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documentos')}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === 'documentos' ? '#0b2c4d' : '#f3f4f6',
                    color: activeTab === 'documentos' ? '#fff' : '#374151',
                    borderRadius: '6px',
                    border: 0,
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isImovel ? 'Matrícula & Jurídico' : isMaterial ? 'Documentação & Origem' : 'Documentação & Cautelar'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('condicoes')}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === 'condicoes' ? '#0b2c4d' : '#f3f4f6',
                    color: activeTab === 'condicoes' ? '#fff' : '#374151',
                    borderRadius: '6px',
                    border: 0,
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isImovel ? 'Posse & Escritura' : 'Retirada & Frete'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('historico')}
                  style={{
                    padding: '8px 14px',
                    background: activeTab === 'historico' ? '#0b2c4d' : '#f3f4f6',
                    color: activeTab === 'historico' ? '#fff' : '#374151',
                    borderRadius: '6px',
                    border: 0,
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Histórico de Disputa ({lot.lances})
                </button>
              </div>

              <div style={{ marginTop: '14px', fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                {activeTab === 'detalhes' && (
                  isImovel ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Tipo de Imóvel</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.tipoImovel || 'Imóvel'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Localização / UF</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.cidade ? `${lot.cidade} - ${lot.uf}` : 'Brasil'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Área Total</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.areaTotal || 'Conforme Matrícula'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Área Construída</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.areaConstruida || 'N/A'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Situação de Ocupação</div>
                        <div style={{ fontWeight: 600, color: '#16a34a' }}>{lot.ocupacao || 'Desocupado'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Quartos / Vagas</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>
                          {lot.quartos ? `${lot.quartos} Quartos` : ''} {lot.vagas ? `• ${lot.vagas} Vagas` : (!lot.quartos ? 'N/A' : '')}
                        </div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Matrícula / Cartório</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.matricula || 'Registro de Imóveis competente'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>IPTU / Tributos</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.iptu || 'Quitado até a arrematação'}</div>
                      </div>
                    </div>
                  ) : isMaterial ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Categoria</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>Equipamentos / Materiais</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Quantidade / Lote</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.quantidade || 'Lote Único'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Estado de Conservação</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.condicaoMaterial || 'Bom Estado'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Local de Armazenagem</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>Pátio RP - Galpão Ribeirão Preto / SP</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Combustível</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.combustivel || 'Flex'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Câmbio</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.cambio || 'Manual'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Quilometragem</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.km || 'Original'}</div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ color: '#9ca3af', fontSize: '11px' }}>Cor</div>
                        <div style={{ fontWeight: 600, color: '#111' }}>{lot.cor || 'Padrão'}</div>
                      </div>
                      {lot.tracao && (
                        <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#9ca3af', fontSize: '11px' }}>Tração</div>
                          <div style={{ fontWeight: 600, color: '#111' }}>{lot.tracao}</div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {activeTab === 'documentos' && (
                  isImovel ? (
                    <div>
                      <p>
                        <strong>Matrícula e Regularidade:</strong> {lot.matricula || 'Matrícula averbada'}. Imóvel leiloado livre de penhoras, hipotecas ou ônus anteriores decorrentes de débitos do antigo proprietário, conforme o art. 130 do Código Tributário Nacional.
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Origem e Comitente:</strong> {lot.origem || 'Alienação Fiduciária consolidada (Lei Federal 9.514/1997)'}. Dívidas de IPTU anteriores à arrematação quitadas pelo comitente vendedor.
                      </p>
                    </div>
                  ) : isMaterial ? (
                    <div>
                      <p>
                        <strong>Nota de Leilão:</strong> Emitida pelo Leiloeiro Oficial juntamente com a Nota Fiscal Eletrônica (NFe) do comitente vendedor.
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Procedência & Garantia:</strong> Bens originários de renovação corporativa ou recuperação patrimonial com garantia de procedência.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        <strong>Laudo Cautelar:</strong> Aprovado com apontamentos normais de uso. Motor dando partida, câmbio operante, estrutura íntegra.
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Documentação:</strong> IPVA do ano corrente pago pelo comitente vendedor. CRLV digital emitido após comprovação de pagamento.
                      </p>
                    </div>
                  )
                )}

                {activeTab === 'condicoes' && (
                  isImovel ? (
                    <div>
                      <p>
                        <strong>Imissão na Posse:</strong> {lot.ocupacao === 'Desocupado' ? 'Imóvel desocupado. Chaves disponibilizadas imediatamente após quitação.' : 'Suporte jurídico prestado para emissão célere de mandado de posse.'}
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Escritura Pública:</strong> Lavrada em Tabelionato de Notas competente no prazo de até 30 dias a contar da quitação.
                      </p>
                    </div>
                  ) : isMaterial ? (
                    <div>
                      <p>
                        <strong>Local de Retirada:</strong> Pátio RP Leilões — Galpão Logístico: R. Gen. Câmara, 2930 - Vila Recreio, Ribeirão Preto - SP.
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Carregamento & Frete:</strong> Retirada com agendamento prévio ou envio por transportadora com frete a combinar.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        <strong>Local de Retirada:</strong> Pátio RP Leilões — R. Gen. Câmara, 2930 - Vila Recreio, Ribeirão Preto - SP.
                      </p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Entrega em Domicílio:</strong> Disponível para todos os estados do Brasil via caminhão cegonha credenciado com rastreamento integral.
                      </p>
                    </div>
                  )
                )}

                {activeTab === 'historico' && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#0b2c4d', marginBottom: '10px' }}>
                      Auditoria de Lances em Tempo Real
                    </div>
                    {bidHistory.length === 0 ? (
                      <p style={{ color: '#64748b' }}>Nenhum lance registrado até o momento. Seja o primeiro arrematante a ofertar!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {bidHistory.map((item, idx) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              backgroundColor: idx === 0 ? '#f0fdf4' : '#f8fafc',
                              border: '1px solid',
                              borderColor: idx === 0 ? '#bbf7d0' : '#e2e8f0',
                              borderRadius: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  color: idx === 0 ? '#15803d' : '#64748b'
                                }}
                              >
                                #{bidHistory.length - idx}
                              </span>
                              <div>
                                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                                  {item.usuarioNome} {item.isCurrentUser && '(Você)'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>
                                  Doc: {item.usuarioDocMasc} • {item.dataHora}
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, color: idx === 0 ? '#16a34a' : '#0b2c4d', fontSize: '15px' }}>
                                {formatCurrency(item.valor)}
                              </div>
                              {idx === 0 && (
                                <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                                  LANCE VENCEDOR
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && currentUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 10005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '26px'
              }}
            >
              ⚖️
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0b2c4d', margin: '0 0 6px' }}>
              Confirmar Envio de Lance Oficial
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
              Você está prestes a registrar um lance irrevogável no leilão:
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'left',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Lote:</span>{' '}
                <strong>LOTE {lot.loteNum} - {lot.titulo}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Arrematante:</span>{' '}
                <strong>{currentUser.nome}</strong> ({currentUser.id})
              </div>
              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#0b2c4d' }}>Valor da Proposta:</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a' }}>
                  {formatCurrency(chosenBid)}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'left', margin: '0 0 20px', lineHeight: '1.4' }}>
              * Os lances são auditados e gravados. Em caso de arrematação vitoriosa, o auto de arrematação é emitido em seu nome e CPF.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmBidExecution}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Confirmar Lance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal Integration */}
      {currentUser && isDocModalOpen && (
        <DocumentosUploadModal
          isOpen={isDocModalOpen}
          user={currentUser}
          onClose={() => setIsDocModalOpen(false)}
          onSuccess={(updatedUser) => {
            setIsDocModalOpen(false);
            setBidError(null);
            if (onUserUpdated) {
              onUserUpdated(updatedUser);
            }
          }}
        />
      )}
    </>
  );
};
