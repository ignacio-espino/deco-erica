from django.db import models


class Customer(models.Model):
    NAME_MAX_LENGTH = 80
    _full_name = models.CharField(max_length=NAME_MAX_LENGTH)
    _cell_number = models.IntegerField()
    _address = models.CharField(max_length=NAME_MAX_LENGTH)
    _email = models.CharField(max_length=NAME_MAX_LENGTH)

    @classmethod
    def new_from(cls, full_name, cell_number, address, email):
        return cls(_full_name=full_name, _cell_number=cell_number, _address=address, _email=email)

    def __str__(self):
        return f'Cliente: {self.name()}'

    def name(self):
        return self._full_name

    def cell_number(self):
        return self._cell_number

    def address(self):
        return self._address

    def email(self):
        return self._email
