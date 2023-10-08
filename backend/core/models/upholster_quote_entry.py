from django.db import models

from core.models.quote_entry import QuoteEntry


class UpholsterQuoteEntry(QuoteEntry):
    _foam = models.ForeignKey('Foam', on_delete=models.CASCADE, blank=True, null=True,
                              related_name='upholster_quote_entry', verbose_name='Espuma')
    _sewing_method = models.CharField('Confección', max_length=250, null=True, blank=True)
    _sewing_cost = models.DecimalField('Costo de confección', max_digits=10, decimal_places=2, blank=True, null=True)
    _foam_cost = models.DecimalField('Costo de espuma', max_digits=10, decimal_places=2, blank=True, null=True)


    @classmethod
    def new_with(cls, quote, product_quantity, fabric, total_cost, sewing, fabric_cost, sewing_cost, foam, foam_cost):
        upholster_quote_entry = cls(_quote=quote, _product_quantity=product_quantity, _fabric=fabric, _total_cost=total_cost,
                                    _sewing_method=sewing, _sewing_cost=sewing_cost,
                                    _fabric_cost=fabric_cost)
        upholster_quote_entry._foam = foam
        upholster_quote_entry._foam_cost = foam_cost
        upholster_quote_entry.save()
        return upholster_quote_entry

    class Meta:
        verbose_name = 'Entrada de cotización de tapicería'
        verbose_name_plural = 'Entradas de cotizaciones de tapicería'
