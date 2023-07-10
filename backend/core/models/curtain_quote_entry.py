from django.db import models

from core.models.quote_entry import QuoteEntry


class CurtainQuoteEntry(QuoteEntry):
    _system = models.ForeignKey('CurtainSystem', on_delete=models.CASCADE, blank=True, null=True,
                                related_name='curtain_quote_entry', verbose_name='Sistema')
    _sewing_method = models.ForeignKey('SewingMethod', on_delete=models.CASCADE, blank=True, null=True,
                                related_name='curtain_quote_entry', verbose_name='Confección')

    class Meta:
        verbose_name = 'Entrada de cotización de cortinería'
        verbose_name_plural = 'Entradas de cotizaciones de cortinería'
