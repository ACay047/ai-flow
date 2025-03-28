import styled, { css, keyframes } from "styled-components";
import ReactFlow, { MiniMap, Controls, Panel, Handle } from "reactflow";

import { createGlobalStyle } from "styled-components";
import { darken } from "polished";
import { FiCopy } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4em;
  min-height: 70px;
  background-color: ${({ theme }) => theme.nodeBg};
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  padding-left: 1em;
  padding-right: 1em;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

export const NodeBand = styled.div<{ selected?: boolean; color?: string }>`
  padding: 2px;
  overflow: hidden;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme, selected, color }) =>
    color ? color : selected ? theme.accentSelected : theme.accent};
`;

export const NodeTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const NodeContent = styled.div.attrs({
  className: "flex flex-col h-auto w-full flex-grow justify-center p-4",
})`
  color: ${({ theme }) => theme.text};
`;

export const NodeForm = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;

export const NodeLabel = styled.label``;

export const StyledNodeTextarea = styled.textarea<{ withMinHeight?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  line-height: 1.5em;
  background-color: ${({ theme }) => theme.nodeInputBg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: ${({ withMinHeight }) => (withMinHeight ? "8rem" : undefined)};
  width: 100%;
  height: auto;
  transition:
    box-shadow 0.3s ease-in-out,
    background-color 0.3s ease;

  &:hover,
  &:focus {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

export const NodeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.text};
  max-width: 1.3em;
  font-size: 1.3em;
`;

export const NodeContainer = styled.div<{ width?: number }>`
  width: 35em;

  background: ${({ theme }) => theme.nodeGradientBg};
  background-color: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

export const NodeLogsText = styled.p`
  font-size: 1em;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

export const NodeLogs = styled.div<{ showLogs: boolean; noPadding?: boolean }>`
  border-radius: 0 0 8px 8px;
  font-size: 1.1em;
  line-height: 1.4em;
  padding: ${({ noPadding }) => (noPadding ? "0px" : "10px 16px")};
  overflow: hidden;
  word-break: break-word;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme }) => theme.outputBg};
  color: ${({ theme }) => theme.accentText};
  cursor: pointer;
  max-height: 700px;
  overflow-y: auto;
  overflow-wrap: break-word;
`;

export const OptionSelector = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: fit-content;
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg};
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
  padding: 3px;
  gap: 5px;
`;

export const OptionButton = styled.button<{ selected: boolean }>`
  flex-grow: 1;
  padding: 10px 10px;
  font-size: 1.1rem;
  background: ${({ selected, theme }) =>
    selected ? theme.optionButtonBgSelected : null};
  color: ${({ selected, theme }) =>
    selected ? theme.optionButtonColorSelected : theme.optionButtonColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: bold;

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.optionButtonBg : darken(0.1, theme.optionButtonBg)};
    color: ${({ theme }) => theme.optionButtonColorSelected};
  }
`;

export const NodeSelect = styled.select`
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  background-color: ${({ theme }) => theme.nodeInputBg};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
  resize: vertical;
  height: fit-content;
  transition: all 0.3s ease;
`;

export const NodeSelectOption = styled.option`
  padding: 10px 16px;
`;

export const ReactFlowStyled = styled(ReactFlow)`
  .react-flow__attribution {
    background: transparent;
  }
`;

export const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.minimapBg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${(props) => props.theme.minimapMaskBg};
    stroke: none;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

export const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CopyIcon = styled(FiCopy)`
  color: ${(props) => props.theme.controlsColor};

  :hover {
    color: #000000;
  }
`;

export const InputHandle = styled(Handle)<{ required?: boolean }>`
  z-index: 45;
  background: ${({ required }) => (required ? "#F09686" : "#72c8fa")};
  width: 0.75em;
  height: 0.75em;

  @media (max-width: 600px) {
    width: 1.25em;
    height: 1.25em;
  }

  border-radius: 50%;
  border: none;
  box-shadow: ${({ required }) =>
    required
      ? "0 0 10px 2px rgba(240, 150, 134, 0.5)"
      : "0 0 10px 2px rgba(114, 200, 250, 0.3)"};
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    background: #89d0fc;
    box-shadow: 0 0 15px 7px rgba(114, 200, 250, 0.5);
  }
`;

export const OutputHandle = styled(Handle)`
  z-index: 45;
  background: rgb(224, 166, 79);
  width: 10px;
  height: 10px;
  box-shadow: 0 0 10px 2px rgba(224, 166, 79, 0.3);
  border-radius: 0;
  border: none;
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: 600px) {
    width: 1.25em;
    height: 1.25em;
  }

  &:hover {
    background: rgb(234, 176, 89);
    box-shadow: 0 0 15px 7px rgba(224, 166, 79, 0.5);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

export const LoadingScreenSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: rgb(132, 250, 176);
  animation: ${spin} 1s ease infinite;
`;
