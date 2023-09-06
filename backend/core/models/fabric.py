from django.db import models


class Fabric(models.Model):
    _code = models.CharField('Código', max_length=4, null=True, blank=True, unique=True, db_index=True)
    _name = models.CharField('Nombre', max_length=80, null=True, blank=True)
    _price = models.DecimalField('Costo de la tela', max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'{self.name()}'

    @classmethod
    def new_from(cls, code, name, price):
        fabric = cls(_code=code, _name=name, _price=price)
        fabric.save()
        return fabric

    @classmethod
    def update_price(cls, code, name, price):
        fabric = cls.objects.filter(_code=int(code))
        if fabric:
            fabric._price = price
            fabric._name = name
        else:
            fabric = cls.new_from(code, name, price)
        return fabric

    def code(self):
        return self._code

    def name(self):
        return self._name

    def price(self):
        return self._price

    class Meta:
        verbose_name = 'Tela'
        verbose_name_plural = 'Telas'
