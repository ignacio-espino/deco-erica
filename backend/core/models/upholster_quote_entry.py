from django.db import models

from core.models.quote_entry import QuoteEntry


class UpholsterQuoteEntry(QuoteEntry):
    _foam = models.ForeignKey('Foam', on_delete=models.CASCADE, blank=True, null=True,
                              related_name='upholster_quote_entry', verbose_name='Espuma')

    class Meta:
        verbose_name = 'Entrada de cotización de tapicería'
        verbose_name_plural = 'Entradas de cotizaciones de tapicería'
