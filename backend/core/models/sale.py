from django.db import models


class Sale(models.Model):
    CREADA = 'CREADA'
    EN_TALLER = 'EN_TALLER'
    LISTO_PARA_ENTREGAR = 'LISTO_PARA_ENTREGAR'
    FINALIZADA = 'FINALIZADA'
    STATE = (
        (CREADA, 'Creada'),
        (EN_TALLER, 'En Taller'),
        (LISTO_PARA_ENTREGAR, 'Listo para entregar'),
        (FINALIZADA, 'Finalizada'),
    )

    _number = models.IntegerField('Número', blank=True, null=True)
    _quote = models.OneToOneField('Quote', on_delete=models.CASCADE, blank=True, null=True, related_name='sale',
                                  verbose_name='Cotización')
    _delivery_date = models.DateTimeField('Fecha de entrega', blank=True, null=True)
    _date = models.DateTimeField('Fecha', auto_now_add=True)
    _tracking_state = models.CharField('Estado', max_length=250, choices=STATE, null=True, blank=True, default=CREADA)
    _fabric_requested = models.BooleanField('Telas encargadas', default=False)
    _systems_requested = models.BooleanField('Sistemas encargados', default=False)
    _order_shipped = models.BooleanField('Orden enviada', default=False)

    def __str__(self):
        return f'Venta {self.number()}'

    def number(self):
        return self._number

    def quote(self):
        return self._quote

    def state(self):
        return self._tracking_state

    def fabric_requested(self):
        return self._fabric_requested

    def systems_requested(self):
        return self._systems_requested

    def order_shipped(self):
        return self._order_shipped

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'
