from django.db import models

from core.models.quote_entry import QuoteEntry


class CurtainQuoteEntry(QuoteEntry):
    _system = models.ForeignKey('CurtainSystem', on_delete=models.CASCADE, blank=True, null=True,
                                related_name='curtain_quote_entry', verbose_name='Sistema')
    _sewing_method = models.ForeignKey('SewingMethod', on_delete=models.CASCADE, blank=True, null=True,
                                       related_name='curtain_quote_entry', verbose_name='Confección')
    _sewing_cost = models.DecimalField('Costo de confección', max_digits=10, decimal_places=2, blank=True, null=True)
    _system_cost = models.DecimalField('Costo de sistema', max_digits=10, decimal_places=2, blank=True, null=True)

    @classmethod
    def new_curtain_quote_entry(cls, quote, product_quantity, room, fabric, fabric_length, fabric_height, fabric_color,
                                subtotal, total_cost, system, sewing, fabric_cost, sewing_cost, system_cost,
                                installation_cost, installation):
        curtain_quote_entry = cls(_quote=quote, _product_quantity=product_quantity, _room=room, _fabric=fabric,
                                  _fabric_length=fabric_length, _fabric_height=fabric_height,
                                  _fabric_color=fabric_color, _subtotal=subtotal, _total_cost=total_cost,
                                  _system=system, _sewing_method=sewing, _sewing_cost=sewing_cost,
                                  _fabric_cost=fabric_cost, _system_cost=system_cost,
                                  _installation_cost=installation_cost, _installation=installation)
        curtain_quote_entry.save()
        return curtain_quote_entry

    class Meta:
        verbose_name = 'Entrada de cotización de cortinería'
        verbose_name_plural = 'Entradas de cotizaciones de cortinería'
