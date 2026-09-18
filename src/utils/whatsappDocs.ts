export const WHATSAPP_DOCS_NUMBER = '5554920036253';
export const WHATSAPP_DOCS_FORMATTED = '(54) 92003-6253';
export const WHATSAPP_DOCS_INTL = '+55 (54) 92003-6253';

export interface UserDocInfo {
  nome?: string;
  documento?: string; // CPF or CNPJ
  email?: string;
  id?: string;
  telefone?: string;
}

/**
 * Generates the pre-filled official message for sending documents via WhatsApp
 */
export function generateWhatsAppDocsMessage(data?: UserDocInfo | null): string {
  const nome = data?.nome?.trim() || '';
  const cpf = data?.documento?.trim() || '';
  const email = data?.email?.trim() || '';
  const id = data?.id?.trim() || '';

  let msg = `Olá! Gostaria de enviar meus documentos para homologação e liberação de lances no Pátio RP Leilões.\n\n`;

  if (nome) {
    msg += `👤 *Arrematante:* ${nome}\n`;
  }
  if (cpf) {
    msg += `📄 *CPF/CNPJ:* ${cpf}\n`;
  }
  if (email) {
    msg += `📧 *E-mail:* ${email}\n`;
  }
  if (id) {
    msg += `🆔 *ID do Cadastro:* ${id}\n`;
  }

  msg += `\nEstou enviando em anexo os 3 documentos solicitados:\n`;
  msg += `1️⃣ *Frente do Documento* (RG ou CNH)\n`;
  msg += `2️⃣ *Verso do Documento* (RG ou CNH)\n`;
  msg += `3️⃣ *Foto com Documento* (Selfie segurando o RG ao lado do rosto)\n\n`;
  msg += `Por favor, confirmem o recebimento e a homologação do meu cadastro para liberação imediata dos meus lances. Obrigado!`;

  return msg;
}

/**
 * Returns the full wa.me URL with pre-encoded message targeting phone 5554920036253
 */
export function getWhatsAppDocsUrl(data?: UserDocInfo | null): string {
  const text = generateWhatsAppDocsMessage(data);
  return `https://wa.me/${WHATSAPP_DOCS_NUMBER}?text=${encodeURIComponent(text)}`;
}
