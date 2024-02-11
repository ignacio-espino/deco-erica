
from core.commands.base import Command
from core.commands.get_products_information_command import GetProductsInformationCommand
from core.endpoints.base import Endpoint


class GetProductsInformationEndpoint(Endpoint):
    def _get_command(self, request_data) -> Command:
        return GetProductsInformationCommand()
