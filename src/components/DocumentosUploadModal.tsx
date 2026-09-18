import React, { useState } from 'react';
import { RegisteredUser } from '../types';
import { authService } from '../services/authService';
import { processDocumentImage } from '../utils/imageCompressor';
import { WhatsAppDocCard } from './WhatsAppDocCard';

interface DocumentosUploadModalProps {
  isOpen: boolean;
  user: RegisteredUser;
  onClose: () => void;
  onSuccess: (updatedUser: RegisteredUser) => void;
  customTitle?: string;
  customMessage?: string;
}

export const DocumentosUploadModal: React.FC<DocumentosUploadModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
  customTitle,
  customMessage
}) => {
  const [docFrente, setDocFrente] = useState<string>(user?.docFrente || '');
  const [docVerso, setDocVerso] = useState<string>(user?.docVerso || '');
  const [docSelfie, setDocSelfie] = useState<string>(user?.docSelfie || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingField, setProcessingField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'frente' | 'verso' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingField(field);
      setErrorMsg(null);
      const compressedDataUrl = await processDocumentImage(file, 1200, 0.78);

      if (field === 'frente') setDocFrente(compressedDataUrl);
      if (field === 'verso') setDocVerso(compressedDataUrl);
      if (field === 'selfie') setDocSelfie(compressedDataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
      setErrorMsg('Falha ao processar a imagem. Tente outro arquivo ou formato (JPG/PNG).');
    } finally {
      setProcessingField(null);
    }
  };

  const handleSaveDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!docFrente) {
      setErrorMsg('É obrigatório anexar a Frente do seu documento (RG ou CNH).');
      return;
    }
    if (!docVerso) {
      setErrorMsg('É obrigatório anexar o Verso do seu documento (RG ou CNH).');
      return;
    }
    if (!docSelfie) {
      setErrorMsg('É obrigatório anexar a Foto Segurando o seu RG para validação facial.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.updateUserDocuments(user.id, {
        docFrente,
        docVerso,
        docSelfie
      });

      setLoading(false);

      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Erro ao enviar documentos. Tente novamente.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Erro na conexão com o servidor. Tente novamente.');
    }
  };

  const isComplete = Boolean(docFrente && docVerso && docSelfie);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10500,
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
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
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
          <div>
            <span
              style={{
                backgroundColor: '#B8874C',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'inline-block',
                marginBottom: '6px'
              }}
            >
              Homologação Oficial de Lances
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              {customTitle || 'Envio Obrigatório de Documentos'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {/* Warning Banner */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>⚠️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', marginBottom: '4px' }}>
                Exigência Legal da Junta Comercial e Edital do Leilão
              </div>
              <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
                {customMessage ||
                  'Para segurança das disputas e habilitação formal para dar lances, anexe a frente, o verso do seu documento oficial (RG ou CNH) e uma foto segurando o documento próximo ao seu rosto.'}
              </div>
            </div>
          </div>

          {/* WhatsApp Document Submission Option */}
          <div style={{ marginBottom: '22px' }}>
            <WhatsAppDocCard
              user={{
                nome: user.nome,
                documento: user.documento,
                email: user.email,
                id: user.id,
                telefone: user.telefone
              }}
            />
          </div>

          {/* Divider with OR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0',
              color: '#94a3b8'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#64748b' }}>
              Ou anexe os arquivos diretamente pelo site
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#991b1b',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '18px'
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSaveDocuments}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. DOCUMENTO FRENTE */}
              <div
                style={{
                  border: docFrente ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: docFrente ? '#f0fdf4' : '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0b2c4d' }}>
                      1. Documento - Frente (RG ou CNH)
                    </span>
                    <span style={{ color: '#dc2626', marginLeft: '4px', fontWeight: 800 }}>*</span>
                  </div>
                  {docFrente && (
                    <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 700 }}>
                      ✓ Anexado
                    </span>
                  )}
                </div>

                {docFrente ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={docFrente}
                      alt="Frente do Documento"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '88px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #86efac'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
                        Frente anexada e pronta para homologação.
                      </div>
                      <label
                        style={{
                          fontSize: '12px',
                          color: '#0b2c4d',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Substituir foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'frente')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #94a3b8',
                        borderRadius: '8px',
                        padding: '18px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '26px', marginBottom: '6px' }}>🪪</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0b2c4d' }}>
                        {processingField === 'frente' ? 'Otimizando imagem...' : 'Clique para enviar Foto da Frente'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        RG aberto ou CNH (JPG, PNG)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'frente')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* 2. DOCUMENTO VERSO */}
              <div
                style={{
                  border: docVerso ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: docVerso ? '#f0fdf4' : '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0b2c4d' }}>
                      2. Documento - Verso (RG ou CNH)
                    </span>
                    <span style={{ color: '#dc2626', marginLeft: '4px', fontWeight: 800 }}>*</span>
                  </div>
                  {docVerso && (
                    <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 700 }}>
                      ✓ Anexado
                    </span>
                  )}
                </div>

                {docVerso ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={docVerso}
                      alt="Verso do Documento"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '88px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #86efac'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
                        Verso anexado e legível.
                      </div>
                      <label
                        style={{
                          fontSize: '12px',
                          color: '#0b2c4d',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Substituir foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'verso')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #94a3b8',
                        borderRadius: '8px',
                        padding: '18px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '26px', marginBottom: '6px' }}>🔄</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0b2c4d' }}>
                        {processingField === 'verso' ? 'Otimizando imagem...' : 'Clique para enviar Foto do Verso'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Com dados e assinaturas nítidos
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'verso')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* 3. FOTO SEGURANDO O RG */}
              <div
                style={{
                  border: docSelfie ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: docSelfie ? '#f0fdf4' : '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0b2c4d' }}>
                      3. Foto Segurando o Documento (Selfie com RG/CNH)
                    </span>
                    <span style={{ color: '#dc2626', marginLeft: '4px', fontWeight: 800 }}>*</span>
                  </div>
                  {docSelfie && (
                    <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 700 }}>
                      ✓ Anexado
                    </span>
                  )}
                </div>

                {docSelfie ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={docSelfie}
                      alt="Selfie Segurando Documento"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #86efac'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
                        Selfie com documento validada.
                      </div>
                      <label
                        style={{
                          fontSize: '12px',
                          color: '#0b2c4d',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Substituir foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'selfie')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #94a3b8',
                        borderRadius: '8px',
                        padding: '18px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '26px', marginBottom: '6px' }}>🤳</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0b2c4d' }}>
                        {processingField === 'selfie' ? 'Otimizando imagem...' : 'Clique para enviar Foto Segurando o Documento'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Segure o documento próximo ao seu rosto, com boa iluminação
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'selfie')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Enviar Depois
              </button>

              <button
                type="submit"
                disabled={loading || !isComplete}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isComplete ? '#16a34a' : '#94a3b8',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: isComplete ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Validando e Salvando no Firestore...' : isComplete ? '✓ Confirmar e Liberar Lances' : 'Anexe os 3 Documentos para Concluir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
