from dateutil.relativedelta import relativedelta
from django.utils import timezone

from django.db import models


class Quote(models.Model):
    _number = models.IntegerField('Número', blank=True, null=True)
    _customer = models.ForeignKey('Customer', on_delete=models.CASCADE, blank=True, null=True,
                                  related_name='customer', verbose_name='Cliente')
    _seller = models.CharField('Vendedor', max_length=80, null=True, blank=True)
    _discount = models.DecimalField('Descuento', max_digits=10, decimal_places=2, blank=True, null=True)
    _delivery_date = models.DateTimeField('Fecha de entrega', blank=True, null=True)
    _date = models.DateTimeField('Fecha', auto_now_add=True)
    _total_cost = models.DecimalField('Costo total', max_digits=10, decimal_places=2, blank=True, null=True)
    _observations = models.TextField('Observaciones', max_length=500, null=True, blank=True)

    def __str__(self):
        return f'Cotización {self.number()} ({self.customer().name()})'

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

    @classmethod
    def new_from(cls, customer, data, requires_installation):
        delivery_date = None
        if requires_installation:
            delivery_date = timezone.now() + relativedelta(days=15)
        return cls(_number=data['number'],
                   _customer=customer,
                   _discount=data['discount'],
                   _seller=data['seller'],
                   _delivery_date=delivery_date,
                   _total_cost=1,
                   )

    class Meta:
        verbose_name = 'Cotización'
        verbose_name_plural = 'Cotizaciones'
