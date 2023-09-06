from django.db import models


class CurtainSystem(models.Model):
    _name = models.CharField('Nombre', max_length=70, null=True, blank=True)
    _price = models.DecimalField('Precio', max_digits=10, decimal_places=2, blank=True, null=True)

    @classmethod
    def new_from(cls, name, price):
        return cls(_name=name, _price=price)

    def __str__(self):
        return f'{self.name()}'

    def name(self):
        return self._name

    def price(self):
        return self._price

    class Meta:
        verbose_name = 'Sistema de cortina'
        verbose_name_plural = 'Sistemas de cortinas'
