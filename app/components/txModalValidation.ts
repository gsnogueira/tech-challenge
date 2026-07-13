import type { TransactionAttachment, TransactionType } from '../interfaces/transactions';

export type TxModalField = 'description' | 'amount' | 'date' | 'note' | 'attachments';

export type TxModalDraft = {
  type: TransactionType;
  description: string;
  amount: number | string;
  date: string;
  note: string;
  attachments: TransactionAttachment[];
};

export type TxModalFieldErrors = Partial<Record<TxModalField, string>>;

const ATTACHMENT_ENABLED_TYPES: TransactionType[] = ['withdraw', 'payment', 'investment'];

export function canShowAttachments(type: TransactionType): boolean {
  return ATTACHMENT_ENABLED_TYPES.includes(type);
}

export function getTransactionModalHint(type: TransactionType): string {
  if (type === 'deposit') {
    return 'Receitas costumam exigir apenas os dados principais. Anexos ficam ocultos para simplificar o cadastro.';
  }

  if (type === 'transfer') {
    return 'Transferências entre contas ficam mais diretas com poucos campos e sem anexos.';
  }

  if (type === 'investment') {
    return 'Investimentos podem usar anexos para comprovantes e observações mais detalhadas.';
  }

  return 'Você pode adicionar anexos e uma observação para contextualizar a transação.';
}

export function validateTxModalDraft(draft: TxModalDraft): TxModalFieldErrors {
  const errors: TxModalFieldErrors = {};
  const trimmedDescription = draft.description.trim();
  const normalizedAmount = typeof draft.amount === 'string' ? Number(draft.amount) : draft.amount;
  const parsedDate = draft.date ? new Date(`${draft.date}T00:00:00`) : null;

  if (!trimmedDescription) {
    errors.description = 'Informe uma descrição para a transação.';
  } else if (trimmedDescription.length < 3) {
    errors.description = 'A descrição deve ter pelo menos 3 caracteres.';
  }

  if (typeof normalizedAmount !== 'number' || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
    errors.amount = 'Informe um valor maior que zero.';
  } else if (normalizedAmount > 10000000) {
    errors.amount = 'O valor máximo permitido por transação é R$ 10.000.000,00.';
  }

  if (draft.date && (!parsedDate || Number.isNaN(parsedDate.getTime()))) {
    errors.date = 'A data informada é inválida.';
  } else if (draft.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate && parsedDate > today) {
      errors.date = 'A data da transação não pode ser no futuro.';
    }
  }

  if (draft.note.trim().length > 140) {
    errors.note = 'A observação deve ter no máximo 140 caracteres.';
  }

  if (canShowAttachments(draft.type) && draft.attachments.length > 5) {
    errors.attachments = 'Você pode anexar até 5 arquivos por transação.';
  }

  return errors;
}

export function getFieldErrorList(errors: TxModalFieldErrors): string[] {
  return Object.values(errors).filter((message): message is string => Boolean(message));
}

export function hasVisibleFieldError(errors: TxModalFieldErrors, field: TxModalField): boolean {
  return Boolean(errors[field]);
}