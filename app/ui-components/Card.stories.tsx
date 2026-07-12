import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button } from 'gabri-ui-components';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  args: {
    title: 'Resumo do mês',
    subtitle: 'Veja os principais indicadores da operação',
    children: <p>Conteúdo principal do card.</p>,
    footer: <Button variant="ghost">Ver detalhes</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
