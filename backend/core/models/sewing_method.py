from django.db import models


class SewingMethod(models.Model):
    _name = models.CharField('Nombre', max_length=70, null=True, blank=True)
    _value = models.DecimalField('Valor', max_digits=10, decimal_places=2)

    @classmethod
    def new_from(cls, name, value):
        return cls(_name=name, _value=value)

    def __str__(self):
        return f'Confección: {self.name()}'

    def name(self):
        return self._name

    def value(self):
        return self._value

    class Meta:
        verbose_name = 'Método de confección'
        verbose_name_plural = 'Métodos de confección'
