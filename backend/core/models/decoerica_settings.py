from django.db import models


class DecoEricaSettings(models.Model):
    _fabric_surcharge_percentage = models.DecimalField('Porcentaje de sobreprecio de la tela',
                                                       max_digits=10, decimal_places=2, blank=True, null=True)
    _installation_price = models.DecimalField('Precio de instalación',
                                              max_digits=10, decimal_places=2, blank=True, null=True)
    _sewing_price = models.DecimalField('Precio de confección',
                                        max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'Configuración {self.id}'

    def fabric_surcharge_percentage(self):
        return self._fabric_surcharge_percentage

    def installation_price(self):
        return self._installation_price

    def sewing_price(self):
        return self._sewing_price

    class Meta:
        verbose_name = 'Configuración general'
        verbose_name_plural = 'Configuraciones generales'

