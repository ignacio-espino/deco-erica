from django.db import models

from core.models.fabric import Fabric
from core.models.quote import Quote


class QuoteEntry(models.Model):
    LIVING = 'LIVING'
    COMEDOR = 'COMEDOR'
    CUARTO = 'CUARTO'
    COCINA = 'COCINA'
    BANIO = 'BAÑO'
    LAVADERO = 'LAVADERO'
    VESTIDOR = 'VESTIDOR'
    OTRO = 'OTRO'
    ROOM = (
        (LIVING, 'Living'),
        (COMEDOR, 'Comedor'),
        (CUARTO, 'Cuarto'),
        (COCINA, 'Cocina'),
        (BANIO, 'Baño'),
        (LAVADERO, 'Lavadero'),
        (VESTIDOR, 'Vestidor'),
        (OTRO, 'Otro'),
    )
    _quote = models.ForeignKey(Quote, on_delete=models.CASCADE, blank=True, null=True,
                               related_name='quote_entry', verbose_name='Cotización')
    _product_quantity = models.IntegerField('Cantidad', null=True, blank=True)
    _room = models.CharField('Ambiente', max_length=250, choices=ROOM, null=True, blank=True)
    _fabric_length = models.DecimalField('Ancho de la tela', null=True, blank=True, max_digits=10, decimal_places=2)
    _fabric_height = models.DecimalField('Alto de la tela', null=True, blank=True, max_digits=10, decimal_places=2)
    _fabric_color = models.CharField('Color de la tela', max_length=50, null=True, blank=True)
    _installation = models.BooleanField('Instalación', default=False)
    _installation_cost = models.DecimalField('Costo de instalación', max_digits=10, decimal_places=2, blank=True, null=True)
    _total_cost = models.DecimalField('Costo total', max_digits=10, decimal_places=2, blank=True, null=True)
    _fabric_cost = models.DecimalField('Costo por tela', max_digits=10, decimal_places=2, blank=True, null=True)
    _subtotal = models.DecimalField('Subtotal', max_digits=10, decimal_places=2)
    _fabric = models.ForeignKey(Fabric, on_delete=models.CASCADE, blank=True, null=True,
                                related_name='quote_entry', verbose_name='Tela')

    @classmethod
    def new_from(cls, quote, product_quantity, room, fabric, fabric_length, fabric_height, fabric_color, subtotal, total_cost, fabric_cost):
        return cls(_quote=quote, _product_quantity=product_quantity, _room=room, _fabric=fabric, _fabric_length=fabric_length, _fabric_height=fabric_height, _fabric_color=fabric_color, _total_cost=total_cost, _fabric_cost=fabric_cost)

    class Meta:
        verbose_name = 'Entrada de cotización'
        verbose_name_plural = 'Entradas de cotizaciones'
