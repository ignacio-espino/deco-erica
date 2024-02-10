import urllib

from core.commands.base import Command
from core.commands import commands
from core.endpoints.base import Endpoint
from core.paginators.base import Paginator, CollectionPaginator, ByPassPaginator


class LoginEndpoint(Endpoint):
    authentication_classes = []
    permission_classes = []

    def _post_command(self, post_data) -> Command:
        username = post_data['username']
        password = post_data['password']

        chained_commands = [commands.GetUserFromUsernameAndPasswordCommand, commands.LoginCommand]
        return commands.ChainCommands(commands=chained_commands, initial_args=(username, password))


class LogoutEndpoint(Endpoint):
    def _post_command(self, post_data) -> Command:
        user_id = post_data['user_id']
        chain_commands = [commands.GetUserCommand, commands.LogoutCommand]
        return commands.ChainCommands(commands=chain_commands, initial_args=user_id)


class GetTaskEndpoint(Endpoint):
    def _get_command(self, request_data) -> Command:
        task_id = request_data.get('task_id', '')
        return commands.GetTaskCommand(task_id=task_id)


class GetTasksEndpoint(Endpoint):
    def _get_command(self, request_data) -> Command:
        encoded_uri = request_data.get('query', '')
        query = urllib.parse.unquote(encoded_uri)
        return commands.GetTasksCommand(query=query)

    def _get_paginator(self, request_data) -> Paginator:
        try:
            page = int(request_data['page'])
            results_per_page = int(request_data['results_per_page'])
            paginator = CollectionPaginator(page=page, results_per_page=results_per_page)
        except (ValueError, KeyError):
            paginator = ByPassPaginator()
        return paginator


class CreateTaskEndpoint(Endpoint):
    def _post_command(self, post_data) -> Command:
        name = post_data['name']
        description = post_data['description']
        return commands.CreateTaskCommand(name=name, description=description)
