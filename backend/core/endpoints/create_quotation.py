import core.commands
from core.commands.base import Command
from core.commands.create_quotation import CreateQuotationCommand
from core.endpoints.base import Endpoint


class CreateQuotationEndpoint(Endpoint):
    def _post_command(self, post_data) -> Command:
        data = {
            'number': post_data['number'],
            'seller': post_data['seller'],
            'name': post_data['name'],
            'cellphone': post_data['cellphone'],
            'address': post_data['address'],
            'email': post_data['email'],
            'date': post_data['date'],
            'deliveryDate': post_data['deliveryDate'],
            'discount': post_data['discount'],
            'remainingEntries': post_data['remainingEntries'],
            'remainingUpholsterEntries': post_data['remainingUpholsterEntries'],
        }
        print(data)
        return CreateQuotationCommand(data)
