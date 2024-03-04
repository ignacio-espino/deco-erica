from decimal import Decimal
from typing import List

from core.commands.base import Command, Validator
from core.models.fabric import Fabric
from core.models.sewing_method import SewingMethod


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
            data_entry['systemPrice'] = entry['systemPrice'] + 777
            data_entry['taylorPrice'] = calculator.calculate_taylor_price(entry)
            data_entry['sewingPrice'] = entry['sewingPrice'] + 777
            data_entry['subtotal'] = entry['subtotal'] + 777
            data_entry['curtainTotal'] = entry['curtainTotal'] + 777
            data_entry['installationCost'] = entry['installationCost'] + 777 if entry['installationCost'] else 0

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

    def calculate_taylor_price(self, entry):
        # (Ancho x Tipo de confeccion +0.20cm) x $ de tela
        fabric_width = entry['width']
        sewing_method_name = entry['sewing']
        sewing_method = SewingMethod.objects.get(_name=sewing_method_name)
        sewing_value = sewing_method.value()
        fabric_code = entry['product'][0]
        fabric = Fabric.objects.get(_code=fabric_code)
        fabric_price = fabric.price()
        return ((fabric_width * sewing_value) + Decimal(0.2)) * fabric_price

    def calculate_system_price(self, entry):
        # (Ancho x Tipo de Confeccion / 1,50) x $ de Confeccion
        fabric_width = entry['width']
        sewing_method_name = entry['sewing']
        # valor de paño?
        pass
