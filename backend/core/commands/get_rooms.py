from typing import List

from core.commands.base import Command, Validator
from core.models.curtain_system import CurtainSystem
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.quote import Quote
from core.models.quote_entry import QuoteEntry
from core.models.sewing_method import SewingMethod


class GetRoomsCommand(Command):
    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        rooms = self._rooms_names()
        quote_number = Quote.objects.count() + 1
        systems_data = self._curtain_systems()
        sewing_methods = self._sewing_methods()
        fabrics = self._fabrics()
        foams = self._foams()
        data = {
            'rooms': rooms,
            'quote_number': quote_number,
            'systems': systems_data,
            'sewing_methods': sewing_methods,
            'fabrics': fabrics,
            'foams': foams
        }
        result.set_object(data)

    def _rooms_names(self):
        rooms = QuoteEntry.ROOM
        room_names = []
        for room in rooms:
            room_names.append(room[1])
        return room_names

    def _curtain_systems(self):
        systems = CurtainSystem.objects.all()
        systems_data = []
        for system in systems:
            systems_data.append(system.name())
        return systems_data

    def _sewing_methods(self):
        sewing_methods = SewingMethod.objects.all()
        sewing_methods_data = []
        for sewing_method in sewing_methods:
            sewing_methods_data.append(sewing_method.name())
        return sewing_methods_data

    def _fabrics(self):
        fabrics = Fabric.objects.all()
        fabric_data = []
        for fabric in fabrics:
            fabric_data.append((fabric.code(), fabric.name()))
        return fabric_data

    def _foams(self):
        foams = Foam.objects.all()
        foams_data = []
        for foam in foams:
            foams_data.append(foam.type())
        return foams_data
