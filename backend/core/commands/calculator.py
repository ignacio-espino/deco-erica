import math

from decimal import Decimal
from typing import List

from core.commands.base import Command, Validator
from core.models.curtain_system import CurtainSystem
from core.models.fabric import Fabric
from core.models.sewing_method import SewingMethod

from core.models.decoerica_settings import DecoEricaSettings

class CalculatorCommand(Command):
    def __init__(self, data) -> None:
        self._data = data

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        # TODO Adaptar con las cuentas necesarias
        calculator = Calculator()
        new_data = []
        fabric_total_cost = 0
        sewing_total_cost = 0
        system_total_cost = 0
        installing_total_cost = 0
        subtotal_total_cost = 0
        foam_total_cost = 0
        total_cost = 0
        amount_of_entries = len(self._data['entries'])
        upholster_entries = len(self._data['upholsterEntries'])
        for index in range(amount_of_entries):
            entry = self._data['entries'][index]
            data_entry = entry
            system_price = calculator.calculate_system_price(entry)
            taylor_price = calculator.calculate_taylor_price(entry)
            sewing_price = calculator.calculate_sewing_method_price(entry)
            installation_cost = calculator.calculate_installation_cost(entry)
            subtotal = system_price + taylor_price + sewing_price + installation_cost
            data_entry['systemPrice'] = system_price
            data_entry['taylorPrice'] = taylor_price
            data_entry['sewingPrice'] = sewing_price
            data_entry['installationCost'] = installation_cost
            data_entry['subtotal'] = subtotal
            data_entry['curtainTotal'] = subtotal * data_entry['quantity']

            fabric_total_cost += data_entry['taylorPrice']
            sewing_total_cost += data_entry['sewingPrice']
            system_total_cost += data_entry['systemPrice']
            installing_total_cost += data_entry['installationCost']
            subtotal_total_cost += data_entry['subtotal']
            total_cost += data_entry['curtainTotal']

            new_data.append({f'{index}': data_entry})

        for index in range(upholster_entries):
            entry = self._data['upholsterEntries'][index]
            data_entry = entry
            fabric_total_cost += data_entry['upholsterTaylorPrice']
            sewing_total_cost += data_entry['upholsterSewingPrice']
            total_cost += data_entry['upholsterTotal']
            foam_total_cost += data_entry['foamPrice']

        totals = {
            "fabricTotalCost": fabric_total_cost,
            "sewingTotalCost": sewing_total_cost,
            "systemTotalCost": system_total_cost,
            "installingTotalCost": installing_total_cost,
            "subtotalTotalCost": subtotal_total_cost,
            "totalCost": total_cost,
            "foamTotalCost": foam_total_cost,
        }
        new_data.append({"totals": totals})
        result.set_object(new_data)


class Calculator:
    ROMANA_PRICE = 2000
    PANEL_ORIENTAL_PRICE = 2000


    def calculate_taylor_price(self, entry):
        # (Ancho x Tipo de confeccion +0.20cm) x $ de tela
        fabric_width = entry['width']
        fabric_height = entry['height']
        sewing_method_name = entry['sewing']
        sewing_method = SewingMethod.objects.get(_name=sewing_method_name)
        sewing_value = self._get_sewing_method_value(sewing_method, fabric_width, fabric_height)
        fabric_code = entry['product'][0]
        fabric = Fabric.objects.get(_code=fabric_code)
        fabric_price = fabric.price()
        fabric_surcharge = fabric_price * (self.fabric_surcharge_percentage_from_settings() / 100)
        fabric_with_surcharge_price = fabric_price + fabric_surcharge
        return ((fabric_width * sewing_value) + Decimal(0.2)) * fabric_with_surcharge_price

    def calculate_sewing_method_price(self, entry):
        # (Ancho x Tipo de Confeccion / 1,50) x $ de Confeccion
        fabric_width = entry['width']
        fabric_height = entry['height']
        sewing_method_name = entry['sewing']
        sewing_method = SewingMethod.objects.get(_name=sewing_method_name)
        sewing_method_value = self._get_sewing_method_value(sewing_method, fabric_width, fabric_height)
        return Decimal(math.ceil((fabric_width * sewing_method_value) / Decimal(1.5))) * self.sewing_price_from_settings()

    def calculate_system_price(self, entry):
        # Ancho x precio de sistema
        fabric_width = entry['width']
        system_name = entry['system']
        system = CurtainSystem.objects.get(_name=system_name)
        return fabric_width * system.price()

    def calculate_installation_cost(self, entry):
        if entry['requiresInstallation']:
            fabric_width = entry['width']
            return fabric_width * self.installation_price_from_settings()
        return 0

    def _get_sewing_method_value(self, sewing_method, fabric_width, fabric_height):
        if sewing_method.name() == 'Romana':
            return fabric_width * fabric_height * self.ROMANA_PRICE
        if sewing_method.name() == 'Panel Oriental':
            return self.PANEL_ORIENTAL_PRICE  # Unidad x PANEL ORIENTAL (que seria unidad?)
        return sewing_method.value()

    def sewing_price_from_settings(self):
        return self._settings().sewing_price()

    def installation_price_from_settings(self):
        return self._settings().installation_price()

    def fabric_surcharge_percentage_from_settings(self):
        return self._settings().fabric_surcharge_percentage()

    def _settings(self):
        return DecoEricaSettings.objects.first()
