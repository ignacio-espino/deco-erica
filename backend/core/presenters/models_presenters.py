from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils.timezone import localtime

from core.models.models import Task
from core.presenters.base import Presenter


class DatetimePresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return isinstance(obj, datetime)

    def present(self):
        datetime_ = self._obj
        return localtime(datetime_).strftime("%d/%m/%Y - %H:%M")


class UserPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        UserModel = get_user_model()
        return isinstance(obj, UserModel)

    def present(self):
        user = self._obj
        data = {'id': user.id, 'name': user.username}
        return Presenter.for_this(data).present()


class TaskPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return isinstance(obj, Task)

    def present(self):
        task = self._obj
        data = {'id': task.id, 'name': task.name(), 'description': task.description()}
        return Presenter.for_this(data).present()
