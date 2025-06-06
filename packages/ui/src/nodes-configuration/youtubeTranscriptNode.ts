import { NodeConfig } from "./types";

export const youtubeTranscriptNodeConfig: NodeConfig = {
  nodeName: "YoutubeTranscriptNodeName",
  processorType: "youtube_transcript_input",
  icon: "YoutubeLogo",
  fields: [
    {
      name: "url",
      label: "url",
      type: "input",
      required: true,
      placeholder: "URLPlaceholder",
      hasHandle: true,
    },
    {
      name: "language",
      label: "language",
      type: "select",
      options: [
        {
          label: "English",
          value: "en",
          default: true,
        },
        {
          label: "French",
          value: "fr",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "German",
          value: "de",
        },
        {
          label: "Italian",
          value: "it",
        },
        {
          label: "Chinese",
          value: "zh",
        },
        {
          label: "Hindi",
          value: "hi",
        },
        {
          label: "Arabic",
          value: "ar",
        },
        {
          label: "Japanese",
          value: "ja",
        },
        {
          label: "Portuguese",
          value: "pt",
        },

        {
          label: "Russian",
          value: "ru",
        },

        {
          label: "Korean",
          value: "ko",
        },
      ],
    },
  ],
  outputType: "text",
  defaultHideOutput: true,
  section: "input",
  helpMessage: "youtubeTranscriptHelp",
  showHandlesNames: true,
};
