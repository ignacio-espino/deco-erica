from django.db.models import CharField, TextField
from django_extensions.db.models import TimeStampedModel


class Task(TimeStampedModel):
    NAME_MAX_LENGTH = 200
    _name = CharField(max_length=NAME_MAX_LENGTH)
    _description = TextField()

    @classmethod
    def new_from(cls, name, description):
        return cls(_name=name, _description=description)

    def __str__(self):
        return f'Task: {self.name()}'

    def name(self):
        return self._name

    def description(self):
        return self._description
