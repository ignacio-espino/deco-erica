from django.db import models


class Foam(models.Model):
    _type = models.CharField('Tipo', max_length=70, null=True, blank=True)
    _price = models.DecimalField('Precio', max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'{self.type()}'

    @classmethod
    def new_from(cls, type, price):
        return cls(_type=type, _price=price)

    def type(self):
        return self._type

    def price(self):
        return self._price

    class Meta:
        verbose_name = 'Espuma'
        verbose_name_plural = 'Espumas'
