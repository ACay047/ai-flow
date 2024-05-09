import logging
import os
import time
import requests
import eventlet

from ....utils.openapi_client import Client

from ....utils.processor_utils import (
    download_file_as_binary,
    stream_download_file_as_binary,
)

from ....utils.openapi_converter import OpenAPIConverter

from ....utils.openapi_reader import OpenAPIReader

from ..node_config_builder import FieldBuilder, NodeConfigBuilder
from ...context.processor_context import ProcessorContext
from ..model import NodeConfig, Option
from .extension_processor import (
    ContextAwareExtensionProcessor,
    DynamicExtensionProcessor,
)
from datetime import datetime
import re


class StabilityAIGenericProcessor(
    ContextAwareExtensionProcessor, DynamicExtensionProcessor
):
    processor_type = "stabilityai-generic-processor"
    openapi_file_path = "./resources/openapi/stabilityai.json"
    paths_denied = [
        re.compile(r"/v1/"),  # Contains'/v1/'
        re.compile(r"/user/"),  # Contains 'user'
        re.compile(r"/engines/"),  # Contains 'engines'
        re.compile(r"/result/"),  # Contains 'engines'
    ]
    api_reader = None
    all_paths_cache = None
    pooling_paths_cache = None
    allowed_paths_cache = None

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        if StabilityAIGenericProcessor.allowed_paths_cache is None:
            StabilityAIGenericProcessor.initialize_allowed_paths_cache()

        self.api_host = os.getenv(
            "STABLE_DIFFUSION_STABILITYAI_API_HOST", "https://api.stability.ai"
        )
        self.path = self.get_input_by_name("path")
        self.initialize_api_config()
        self.final_node_config = self.get_dynamic_node_config(dict(path=self.path))

    @classmethod
    def initialize_allowed_paths_cache(cls):
        cls.api_reader = OpenAPIReader(StabilityAIGenericProcessor.openapi_file_path)
        paths_names = cls.api_reader.get_all_paths_names()
        cls.all_paths_cache = paths_names
        cls.pooling_paths_cache = [path for path in paths_names if "/result/" in path]
        cls.allowed_paths_cache = [
            path
            for path in paths_names
            if not cls.is_path_banned(path, cls.paths_denied)
        ]

    @staticmethod
    def is_path_banned(path, denied_patterns):
        return any(pattern.search(path) for pattern in denied_patterns)

    @staticmethod
    def get_pooling_path(path_selected):
        for path in StabilityAIGenericProcessor.pooling_paths_cache:
            if path.startswith(path_selected):
                return path
        return None

    def get_node_config(self):
        if StabilityAIGenericProcessor.allowed_paths_cache is None:
            StabilityAIGenericProcessor.initialize_allowed_paths_cache()

        path_options = [
            Option(default=(i == 0), value=name, label=name)
            for i, name in enumerate(StabilityAIGenericProcessor.allowed_paths_cache)
        ]

        path = (
            FieldBuilder()
            .set_name("path")
            .set_label("Path")
            .set_type("select")
            .set_options(path_options)
            .build()
        )

        return (
            NodeConfigBuilder()
            .set_node_name("StabilityAI")
            .set_processor_type(self.processor_type)
            .set_icon("FaRobot")
            .set_section("models")
            .set_help_message("stableDiffusionPromptHelp")
            .set_show_handles(True)
            .add_field(path)
            .set_is_dynamic(True)  # Important
            .build()
        )

    def initialize_api_config(self):
        print(f"Initializing API config for {self.path}")
        response_content_path = self.path
        response_method = "post"

        self.path_accept = StabilityAIGenericProcessor.api_reader.get_path_accept(
            self.path, "post"
        )
        self.pooling_path = self.get_pooling_path(self.path)

        if self.pooling_path is not None:
            response_content_path = self.pooling_path
            response_method = "get"
            self.pooling_path_accept = (
                StabilityAIGenericProcessor.api_reader.get_path_accept(
                    self.pooling_path, "get"
                )
            )

        self.response_content_type = (
            StabilityAIGenericProcessor.api_reader.get_response_content_type(
                response_content_path, response_method
            )[0]
        )

        print(f"Response content type {self.response_content_type}")

    def get_dynamic_node_config(self, data) -> NodeConfig:
        if StabilityAIGenericProcessor.allowed_paths_cache is None:
            StabilityAIGenericProcessor.initialize_allowed_paths_cache()

        selected_api_path = data["path"]

        schema = StabilityAIGenericProcessor.api_reader.get_request_schema_for_path(
            selected_api_path, "post"
        )
        path_accept = StabilityAIGenericProcessor.api_reader.get_path_accept(
            selected_api_path, "post"
        )

        output_type = "videoUrl" if path_accept == "video/*" else "imageUrl"

        pooling_path = self.get_pooling_path(selected_api_path)

        if pooling_path is not None:
            pooling_path_accept = (
                StabilityAIGenericProcessor.api_reader.get_path_accept(
                    pooling_path, "get"
                )
            )
            output_type = "videoUrl" if pooling_path_accept == "video/*" else "imageUrl"

        builder = OpenAPIConverter().convert_schema_to_node_config(schema)

        path_components = selected_api_path.split("/")
        last_component = (
            path_components[-1] if path_components[-1] else path_components[-2]
        )
        node_name = last_component.capitalize()

        return (
            builder.set_node_name(f"StabilityAI - {node_name}")
            .set_processor_type(self.processor_type)
            .set_icon("FaRobot")
            .set_section("models")
            .set_help_message("stableDiffusionPromptHelp")
            .set_output_type(output_type)
            .set_show_handles(True)
            .build()
        )

    def perform_pooling(self, client, path):
        pooling_response = client.get(path=path, accept=self.pooling_path_accept)
        while pooling_response["status"] == "in-progress":
            print("Pooling...")
            eventlet.sleep(0.5)
            pooling_response = client.get(path=path, accept=self.pooling_path_accept)
        return

    def prepare_and_process_response(self, response):
        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        extension = self.get_input_by_name("output_format")
        if extension:
            filename = f"{self.name}-{timestamp_str}.{extension}"
        else:
            extension = self.response_content_type.split("/")[-1]
            filename = f"{self.name}-{timestamp_str}.{extension}"  # Hmmm
        url = storage.save(filename, response)

        return url

    def process(self):

        api_key = self._processor_context.get_value("stabilityai_api_key")
        fields = self.final_node_config.fields
        data = {field.name: self.get_input_by_name(field.name) for field in fields}
        binaryFieldNames = [field.name for field in fields if field.isBinary]
        files = {} if len(binaryFieldNames) > 0 else {"none": (None, "")}

        for field_name in binaryFieldNames:
            url = data[field_name]
            if url:
                files[field_name] = stream_download_file_as_binary(url)
            else:
                files[field_name] = None

        client = Client(
            api_token=api_key,
            base_url=self.api_host,
        )

        response = client.post(
            path=self.path, data=data, files=files, accept=self.path_accept
        )

        if self.pooling_path:
            key_name = next(iter(response))
            key_value = response[key_name]
            updated_pooling_path = self.pooling_path.replace(
                "{" + key_name + "}", str(key_value)
            )
            response = self.perform_pooling(client, updated_pooling_path)

        return self.prepare_and_process_response(response)

    def cancel(self):
        pass
