from django.db import models
from quote import Quote


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
    _installation = models.BooleanField('Instalación', default=False)
    _installation_cost = models.DecimalField('Costo de instalación', max_digits=10, decimal_places=2)
    _subtotal = models.DecimalField('Subtotal', max_digits=10, decimal_places=2)
    _total_cost = models.DecimalField('Costo total', max_digits=10, decimal_places=2)
    _fabric_length = models.DecimalField('Ancho de la tela', null=True, blank=True, max_digits=10, decimal_places=2)
    _fabric_height = models.DecimalField('Alto de la tela', null=True, blank=True, max_digits=10, decimal_places=2)
    _fabric_color = models.CharField('Color de la tela', max_length=50, null=True, blank=True)

    @classmethod
    def new_from(cls, full_name, cell_number, address, email):
        return cls(_full_name=full_name, _cell_number=cell_number, _address=address, _email=email)

    class Meta:
        verbose_name = 'Entrada de cotización'
        verbose_name_plural = 'Entradas de cotizaciones'
