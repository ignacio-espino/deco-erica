from django.db import models


class Quote(models.Model):
    _number = models.IntegerField('Número', unique=True, blank=True, null=True)
    _customer = models.ForeignKey('Customer', on_delete=models.CASCADE, blank=True, null=True,
                                  related_name='customer', verbose_name='Cliente')
    _seller = models.CharField('Vendedor', max_length=80, null=True, blank=True)
    _discount = models.DecimalField('Descuento', max_digits=10, decimal_places=2)
    _delivery_date = models.DateTimeField('Fecha de entrega', blank=True, null=True)
    _date = models.DateTimeField('Fecha', auto_now_add=True)
    _total_cost = models.DecimalField('Costo total', max_digits=10, decimal_places=2)
    _observations = models.TextField('Observaciones', max_length=500, null=True, blank=True)

    def number(self):
        return self._number

    def customer(self):
        return self._customer

    def seller(self):
        return self._seller

    def discount(self):
        return self._discount

    def delivery_date(self):
        return self._delivery_date

    def date(self):
        return self._date

    def total_cost(self):
        return self._total_cost

    def observations(self):
        return self._observations

    class Meta:
        verbose_name = 'Cotización'
        verbose_name_plural = 'Cotizaciones'
