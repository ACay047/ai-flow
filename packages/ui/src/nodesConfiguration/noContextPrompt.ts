import { NodeConfig } from "./nodeConfig";

export const noContextPromptNodeConfig: NodeConfig = {
    nodeName: 'NoContextPrompt',
    icon: 'FaRobot',
    fields: [
        {
            name: 'gptVersion',
            label: '',
            type: 'option',
            options: [
                {
                    label: 'GPT3.5',
                    value: 'gpt-3.5-turbo'
                },
                {
                    label: 'GPT4',
                    value: 'gpt-4'
                }
            ]
        },
        {
            name: 'inputText',
            type: 'textarea',
            label: 'Prompt'
        },

    ],
    outputType: 'text',
    hasInputHandle: true,
};