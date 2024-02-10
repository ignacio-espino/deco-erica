from typing import List

from core.commands.base import Command, Validator
from core.models.curtain_quote_entry import CurtainQuoteEntry
from core.models.curtain_system import CurtainSystem
from core.models.customer import Customer
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.quote import Quote
from core.models.sewing_method import SewingMethod
from core.models.upholster_quote_entry import UpholsterQuoteEntry


class CreateQuotationCommand(Command):
    def __init__(self, data) -> None:
        self._data = data

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        customer = Customer.new_from(full_name=self._data['name'],
                                     cell_number=self._data['cellphone'],
                                     address=self._data['address'],
                                     email=self._data['email'])
        customer.save()
        entries = self._data['remainingEntries']
        upholster_entries = self._data['remainingUpholsterEntries']
        requires_installation = False
        for entry in entries:
            if entry['requiresInstallation']:
                requires_installation = entry['requiresInstallation']
        quote = Quote.new_from(customer=customer, data=self._data, requires_installation=requires_installation)
        quote.save()
        for entry in entries:
            system = CurtainSystem.objects.filter(_name=entry['system']).first()
            sewing = SewingMethod.objects.filter(_name=entry['sewing']).first()
            fabric = Fabric.objects.filter(_code=entry['product'][0]).first()
            CurtainQuoteEntry.new_curtain_quote_entry(
                quote=quote,
                product_quantity=entry['quantity'],
                room=entry['room'].upper(),
                fabric=fabric,
                fabric_length=entry['width'],
                fabric_height=entry['height'],
                fabric_color=entry['color'],
                subtotal=entry['subtotal'],
                total_cost=entry['curtainTotal'],
                system=system,
                sewing=sewing,
                fabric_cost=entry['taylorPrice'],
                sewing_cost=entry['sewingPrice'],
                system_cost=entry['systemPrice'],
                installation_cost=entry['installationCost'],
                installation=entry['requiresInstallation'])
        for entry in upholster_entries:
            fabric = Fabric.objects.filter(_code=entry['product'][0]).first()
            foam = Foam.objects.filter(_type=entry['foam']).first()
            UpholsterQuoteEntry.new_with(
                quote=quote,
                product_quantity=entry['upholsterQuantity'],
                fabric=fabric,
                total_cost=entry['upholsterTotal'],
                sewing=entry['upholsterSewing'],
                fabric_cost=entry['upholsterTaylorPrice'],
                sewing_cost=entry['upholsterSewingPrice'],
                foam=foam,
                foam_cost=entry['foamPrice']
            )

        result.set_object({})
