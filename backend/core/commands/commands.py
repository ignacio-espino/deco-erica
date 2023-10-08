from typing import List

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from core.commands.base import Command, Validator, Result
from core.commands.validators import UserExistValidator, UserIsLoggedValidator, TaskExistsValidator, \
    TextLessThanValidator, NotEmptyStringValidator
from core.errors.errors import ErrorFactory
from core.models.curtain_quote_entry import CurtainQuoteEntry
from core.models.curtain_system import CurtainSystem
from core.models.customer import Customer
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.models import Task
from core.models.quote import Quote
from core.models.quote_entry import QuoteEntry
from core.models.sewing_method import SewingMethod
from core.models.upholster_quote_entry import UpholsterQuoteEntry


class ByPassCommand(Command):
    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        pass


class IdentityCommand(Command):
    def __init__(self, arg) -> None:
        self._arg = arg

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        result.set_object(self._arg)


class ChainCommands(Command):
    """
    Executes one command at a time, it uses the last result as the input for the next command in the chain, and so on.
    You need to pass arguments for the first command.
    It uses shortcut execution. Check the implementation to see how arguments are passed.
    """

    def __init__(self, commands, initial_args) -> None:
        self._commands = commands
        self._initial_args = initial_args

    def validators(self) -> List[Validator]:
        return []

    def _set_command_with_args(self, command, args):
        if type(args) == tuple:
            return command(*args)
        else:
            return command(args)

    def _shortcut_execution(self) -> Result:
        last_result = self._set_command_with_args(command=self._commands[0], args=self._initial_args).execute()
        for command in self._commands[1:]:
            if last_result.has_errors():
                break
            result_object = last_result.get_object()
            last_result = self._set_command_with_args(command=command, args=result_object).execute()
        return last_result

    def _execute_from_successful_validation(self, result):
        execution_result = self._shortcut_execution()
        result.copy_from(another_result=execution_result)


class GetUserFromUsernameAndPasswordCommand(Command):
    def __init__(self, username, password) -> None:
        self._username = username
        self._password = password

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        user = authenticate(username=self._username, password=self._password)
        if user:
            result.set_object(user)
        else:
            result.add_error(ErrorFactory().username_or_password_incorrect())


class LoginCommand(Command):
    def __init__(self, user) -> None:
        self._user = user

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        token, _ = Token.objects.get_or_create(user=self._user)
        result.set_object({'user': self._user, 'token': token.key})


class GetUserCommand(Command):
    def __init__(self, user_id) -> None:
        self._user_id = user_id

    def validators(self) -> List[Validator]:
        return [UserExistValidator(user_id=self._user_id)]

    def _execute_from_successful_validation(self, result):
        result.set_object(User.objects.get(id=self._user_id))


class LogoutCommand(Command):
    def __init__(self, user) -> None:
        self._user = user

    def validators(self) -> List[Validator]:
        return [UserIsLoggedValidator(user=self._user)]

    def _execute_from_successful_validation(self, result):
        Token.objects.get(user=self._user).delete()
        result.set_object({'user': self._user})


class GetTaskCommand(Command):
    def __init__(self, task_id) -> None:
        self._task_id = task_id

    def validators(self) -> List[Validator]:
        return [TaskExistsValidator(task_id=self._task_id)]

    def _execute_from_successful_validation(self, result):
        task = Task.objects.get(id=self._task_id)
        result.set_object(task)


class GetTasksCommand(Command):
    def __init__(self, query) -> None:
        self._query = query

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        tasks = Task.objects.all()

        if self._query != '':
            tasks = tasks.filter(_name__icontains=self._query)

        result.set_object(tasks)


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


class CreateTaskCommand(Command):
    def __init__(self, name, description) -> None:
        self._name = name
        self._description = description

    def validators(self) -> List[Validator]:
        return [
            NotEmptyStringValidator(self._name, field_name='Name'),
            TextLessThanValidator(self._name, max_chars=Task.NAME_MAX_LENGTH),
            NotEmptyStringValidator(self._description, field_name='Description'),
        ]

    def _execute_from_successful_validation(self, result):
        task = Task.new_from(self._name, self._description)
        task.save()
        result.set_object(task)


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
        print('++++++++++++++')
        print(self._data)
        print('++++++++++++++')
        entries = self._data['remainingEntries']
        upholster_entries = self._data['remainingUpholsterEntries']
        requires_installation = False
        for entry in entries:
            if entry['requiresInstallation']:
                requires_installation = entry['requiresInstallation']
        quote = Quote.new_from(customer=customer, data=self._data, requires_installation=requires_installation)
        print('creo quote')
        quote.save()
        print('guardo quote')
        for entry in entries:
            system = CurtainSystem.objects.filter(_name=entry['system']).first()
            sewing = SewingMethod.objects.filter(_name=entry['sewing']).first()
            fabric = Fabric.objects.filter(_code=entry['product'][0]).first()
            print('--AAAAAAAAAAAAAAAAAAAAA--')
            print(entry['room'])
            print('--AAAAAAAAAAAAAAAAAAAAA--')
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
            print('888888888888888888888888888888888888888888888888888')
            print(entry)
            print('888888888888888888888888888888888888888888888888888')
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


class CalculatorCommand(Command):
    def __init__(self, data) -> None:
        self._data = data

    def validators(self) -> List[Validator]:
        return []

    def _execute_from_successful_validation(self, result):
        # TODO Adaptar con las cuentas necesarias
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
            data_entry['taylorPrice'] = entry['taylorPrice'] + 777
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
