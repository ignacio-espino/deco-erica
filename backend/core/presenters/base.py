from django.db.models import QuerySet


class Presenter:
    @classmethod
    def for_this(cls, obj):
        for subclass in cls.__subclasses__():
            if subclass.can_handle(obj):
                return subclass(obj)
        return BypassPresenter(obj)

    @classmethod
    def can_handle(cls, obj) -> bool:
        raise NotImplementedError

    def __init__(self, obj) -> None:
        self._obj = obj

    def present(self):
        raise NotImplementedError


class BypassPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return False

    def present(self):
        return self._obj


class ListPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return type(obj) == list

    def present(self):
        elements = self._obj
        return [Presenter.for_this(element).present() for element in elements]


class DictPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return type(obj) == dict

    def present(self):
        return {key: Presenter.for_this(value).present() for key, value in self._obj.items()}


class QuerySetPresenter(Presenter):
    @classmethod
    def can_handle(cls, obj) -> bool:
        return type(obj) == QuerySet

    def present(self):
        queryset = self._obj
        return Presenter.for_this(list(queryset)).present()
