from django.db import models


class Customer(models.Model):
    _full_name = models.CharField('Nombre completo', max_length=70, null=True, blank=True)
    _cell_number = models.CharField('Celular', max_length=20, null=True, blank=True)
    _email = models.EmailField('Email', blank=True, null=True)
    _address = models.CharField('Dirección', max_length=200, null=True, blank=True)

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

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
