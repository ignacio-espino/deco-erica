from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from core.commands.base import Validator, Result
from core.errors.errors import ErrorFactory
from core.models.models import Task


class UserExistValidator(Validator):
    def __init__(self, user_id) -> None:
        self._user_id = user_id

    def validate(self) -> Result:
        result = Result()

        try:
            User.objects.get(id=self._user_id)
        except (User.DoesNotExist, ValueError):
            result.add_error(ErrorFactory().user_does_not_exist(user_id=self._user_id))

        return result


class UserIsLoggedValidator(Validator):
    def __init__(self, user) -> None:
        self._user = user

    def validate(self) -> Result:
        result = Result()

        try:
            Token.objects.get(user=self._user)
        except Token.DoesNotExist:
            result.add_error(ErrorFactory().user_is_not_logged(user=self._user))

        return result


class TaskExistsValidator(Validator):
    def __init__(self, task_id) -> None:
        self._task_id = task_id

    def validate(self) -> Result:
        result = Result()

        try:
            Task.objects.get(id=self._task_id)
        except (Task.DoesNotExist, ValueError):
            result.add_error(ErrorFactory().task_not_exists_for_id(task_id=self._task_id))

        return result


class TextLessThanValidator(Validator):
    def __init__(self, text, max_chars) -> None:
        self._text = text
        self._max_chars = max_chars

    def validate(self) -> Result:
        result = Result()

        if len(self._text) > self._max_chars:
            result.add_error(ErrorFactory().text_too_long(self._text, self._max_chars))

        return result


class NotEmptyStringValidator(Validator):
    def __init__(self, string, field_name) -> None:
        self._string = string
        self._field_name = field_name

    def validate(self) -> Result:
        result = Result()

        valid_length = 1 <= len(str(self._string))
        if not valid_length:
            result.add_error(ErrorFactory().string_is_empty(self._field_name))

        return result
