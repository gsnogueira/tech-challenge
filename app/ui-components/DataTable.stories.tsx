import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  args: {
    columns: [
      { key: 'description', label: 'Descrição' },
      { key: 'category', label: 'Categoria' },
      { key: 'amount', label: 'Valor' },
    ],
    rows: [
      { description: 'Salário', category: 'Receita', amount: '$4.500' },
      { description: 'Aluguel', category: 'Despesas', amount: '$1.200' },
      { description: 'Marketing', category: 'Investimento', amount: '$650' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {};
