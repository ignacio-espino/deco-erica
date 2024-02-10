from typing import List

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from core.commands.base import Command, Validator, Result
from core.commands.validators import UserExistValidator, UserIsLoggedValidator, TaskExistsValidator, \
    TextLessThanValidator, NotEmptyStringValidator
from core.errors.errors import ErrorFactory
from core.models.curtain_system import CurtainSystem
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.models import Task
from core.models.quote import Quote
from core.models.quote_entry import QuoteEntry
from core.models.sewing_method import SewingMethod


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
