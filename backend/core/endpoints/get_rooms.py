
from core.commands.base import Command
from core.commands.get_rooms import GetRoomsCommand
from core.endpoints.base import Endpoint


class GetRoomsEndpoint(Endpoint):
    def _get_command(self, request_data) -> Command:
        return GetRoomsCommand()
