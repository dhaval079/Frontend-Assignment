import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Logs from '../pages/logs/logs';
export default {
    title: 'Components/Logs',
    component: Logs,
};

// Define the Template function
const Template = (args) =><Logs {...args} />;

// Create a story using the Template
export const Primary = Template.bind({});
Primary.args = {
  // Provide default args for the story
  logs: [
    { timestamp: Date.now(), message: 'Log message 1' },
    { timestamp: Date.now() + 1000, message: 'Log message 2' },
  ],
};