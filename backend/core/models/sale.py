from django.db import models


class Sale(models.Model):
    _number = models.IntegerField('Número', blank=True, null=True)
    _quote = models.OneToOneField('Quote', on_delete=models.CASCADE, blank=True, null=True, related_name='sale',
                                  verbose_name='Cotización')
    _delivery_date = models.DateTimeField('Fecha de entrega', blank=True, null=True)
    _date = models.DateTimeField('Fecha', auto_now_add=True)

    def __str__(self):
        return f'Venta {self.number()}'

    def number(self):
        return self._number

    def quote(self):
        return self._quote

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'
