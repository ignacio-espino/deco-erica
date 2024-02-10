import core.commands
from core.commands.base import Command
from core.commands.calculator import CalculatorCommand
from core.endpoints.base import Endpoint


class CalculatorEndpoint(Endpoint):
    def _post_command(self, post_data) -> Command:
        data = {
            'entries': post_data['entries'],
            'upholsterEntries': post_data['upholsterEntries'],
        }
        return CalculatorCommand(data)
