import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'gabri-ui-components';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Ação principal',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Ghost: Story = {
  args: {
    children: 'Cancelar',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Excluir',
    variant: 'danger',
  },
};
