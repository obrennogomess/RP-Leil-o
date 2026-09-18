import React, { useState } from 'react';

interface VenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenderModal: React.FC<VenderModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoBem: 'veiculo',
    descricao: '',
    cidade: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#5D3A1F', fontSize: '20px' }}></i>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Venda seu Veículo ou Imóvel no Leilão
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 0,
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  margin: '0 auto 16px auto'
                }}
              >
                ✓
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                Solicitação Recebida com Sucesso!
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Nossa equipe de avaliação e captação entrará em contato via WhatsApp ou telefone em até 24 horas úteis para formalizar a proposta de venda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                Desfaça-se de frotas, veículos recuperados, maquinários ou imóveis com liquidez garantida e segurança jurídica através do Pátio RP Leilões.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Nome Completo / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Seu nome ou nome da empresa"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(16) 99999-9999"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Tipo de Bem *
                  </label>
                  <select
                    value={formData.tipoBem}
                    onChange={(e) => setFormData({ ...formData, tipoBem: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
                  >
                    <option value="veiculo">Automóvel / Utilitário</option>
                    <option value="moto">Motocicleta</option>
                    <option value="caminhao">Caminhão / Pesado</option>
                    <option value="frota">Frota Corporativa</option>
                    <option value="imovel">Imóvel (Residencial/Comercial)</option>
                    <option value="equipamento">Equipamentos / Máquinas</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Cidade / Estado do Bem *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="Ex: Ribeirão Preto / SP"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Descrição Resumida (Marca, Modelo, Ano, Quantidade de itens)
                </label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Lote com 4 veículos recuperados ou Caminhão MB Actros 2021 em perfeito estado..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1E3A8A',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Enviar para Avaliação Gratuita
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
