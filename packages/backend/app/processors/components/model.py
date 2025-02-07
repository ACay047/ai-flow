# generated by datamodel-codegen:
#   filename:  schema.json
#   timestamp: 2025-02-07T10:50:57+00:00

from __future__ import annotations

from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, RootModel
from typing_extensions import Literal


class Model(RootModel[Any]):
    root: Any


class FieldType(
    RootModel[
        Literal[
            'boolean',
            'input',
            'inputInt',
            'inputNameBar',
            'list',
            'numericfield',
            'option',
            'select',
            'slider',
            'switch',
            'textToDisplay',
            'textarea',
            'textfield',
        ]
    ]
):
    root: Literal[
        'boolean',
        'input',
        'inputInt',
        'inputNameBar',
        'list',
        'numericfield',
        'option',
        'select',
        'slider',
        'switch',
        'textToDisplay',
        'textarea',
        'textfield',
    ]


class Operator(
    RootModel[
        Literal[
            'equals',
            'exists',
            'greater than',
            'in',
            'less than',
            'not equals',
            'not exists',
            'not in',
        ]
    ]
):
    root: Literal[
        'equals',
        'exists',
        'greater than',
        'in',
        'less than',
        'not equals',
        'not exists',
        'not in',
    ]


class Option(BaseModel):
    default: Optional[bool] = None
    label: Optional[str] = None
    value: Optional[str] = None


class OutputType(
    RootModel[
        Literal[
            '3dUrl',
            'audioUrl',
            'fileUrl',
            'imageBase64',
            'imageUrl',
            'markdown',
            'pdfUrl',
            'text',
            'videoUrl',
        ]
    ]
):
    root: Literal[
        '3dUrl',
        'audioUrl',
        'fileUrl',
        'imageBase64',
        'imageUrl',
        'markdown',
        'pdfUrl',
        'text',
        'videoUrl',
    ]


class SectionType(RootModel[Literal['image-generation', 'input', 'models', 'tools']]):
    root: Literal['image-generation', 'input', 'models', 'tools']


class Condition(BaseModel):
    field: Optional[str] = None
    operator: Optional[Operator] = None
    value: Optional[Any] = None


class ConditionGroup(BaseModel):
    conditions: Optional[List[Condition]] = None
    logic: Optional[Literal['AND', 'OR']] = None


class FieldCondition(RootModel[Union[Condition, ConditionGroup]]):
    root: Union[Condition, ConditionGroup]


class OmitNodeConfigFieldsOutputType(BaseModel):
    defaultHideOutput: Optional[bool] = None
    hasInputHandle: Optional[bool] = None
    helpMessage: Optional[str] = None
    hideFieldsIfParent: Optional[bool] = None
    icon: Optional[str] = None
    inputNames: Optional[List[str]] = None
    isBeta: Optional[bool] = None
    isDynamicallyGenerated: Optional[bool] = None
    nodeName: Optional[str] = None
    processorType: Optional[str] = None
    section: Optional[SectionType] = None
    showHandlesNames: Optional[bool] = None


class Field(BaseModel):
    associatedField: Optional[str] = None
    condition: Optional[FieldCondition] = None
    defaultValue: Optional[Union[List[str], List[float], Union[str, float]]] = None
    description: Optional[str] = None
    hasHandle: Optional[bool] = None
    hidden: Optional[bool] = None
    hideIfParent: Optional[bool] = None
    isBinary: Optional[bool] = None
    isLinked: Optional[bool] = None
    label: Optional[str] = None
    max: Optional[float] = None
    min: Optional[float] = None
    name: Optional[str] = None
    options: Optional[List[Option]] = None
    placeholder: Optional[str] = None
    required: Optional[bool] = None
    type: Optional[FieldType] = None
    withModalEdit: Optional[bool] = None


class NodeConfig(BaseModel):
    defaultHideOutput: Optional[bool] = None
    fields: Optional[List[Field]] = None
    hasInputHandle: Optional[bool] = None
    helpMessage: Optional[str] = None
    hideFieldsIfParent: Optional[bool] = None
    icon: Optional[str] = None
    inputNames: Optional[List[str]] = None
    isBeta: Optional[bool] = None
    isDynamicallyGenerated: Optional[bool] = None
    nodeName: Optional[str] = None
    outputType: Optional[OutputType] = None
    processorType: Optional[str] = None
    section: Optional[SectionType] = None
    showHandlesNames: Optional[bool] = None


class DiscriminatedNodeConfig(BaseModel):
    config: Optional[NodeConfig] = None
    discriminators: Optional[Dict[str, str]] = None


class NodeSubConfig(BaseModel):
    discriminatorFields: Optional[List[str]] = None
    subConfigurations: Optional[List[DiscriminatedNodeConfig]] = None


class NodeConfigVariant(NodeSubConfig, OmitNodeConfigFieldsOutputType):
    pass
