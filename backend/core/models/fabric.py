from django.db import models


class Fabric(models.Model):
    VOILES_Y_LINOS_CORTINAS = 'VOILES_GASAS_Y_LINOS_PARA_CORTINAS'
    BLACKOUT = 'BLACK_OUT_SUN_OUT'
    ARRUGADOS_Y_JAQ_LIVIANOS = 'ARRUGADOS_OPACOS_Y_JAQ_LIVIANOS'
    MANTAS_Y_FUNDAS = 'PARA_MANTAS_Y_FUNDAS'
    BORDADOS = 'BORDADOS'
    TERCIOPELOS_Y_LINOS = 'TERCIOPELOS_Y_LINOS'
    LINOS_PARA_TAPICERIA_Y_FUNDAS = 'LINOS_PARA_TAPICERIA_Y_FUNDAS'
    PANAS_LISAS_Y_TEXTURADAS = 'PANAS_LISAS_Y_TEXTURADAS'
    OUTDOOR = 'OUTDOOR_USO_EXTERIOR'
    SIMIL_CUERO = 'SIMIL_CUERO'
    JAQUARDS = 'JAQUARDS_DE_1_40_Y_2_80_DE_ANCHO'
    ESTAMPADOS = 'ESTAMPADOS'
    CHENILES = 'CHENILES'
    CATEGORY_OPTIONS = (
        (VOILES_Y_LINOS_CORTINAS, 'VOILES, GASAS Y LINOS PARA CORTINAS'),
        (BLACKOUT, 'BLACK OUT / SUN OUT'),
        (ARRUGADOS_Y_JAQ_LIVIANOS, 'ARRUGADOS, OPACOS Y JAQ. LIVIANOS'),
        (MANTAS_Y_FUNDAS, 'PARA MANTAS Y FUNDAS'),
        (BORDADOS, 'BORDADOS'),
        (TERCIOPELOS_Y_LINOS, 'TERCIOPELOS Y LINOS'),
        (LINOS_PARA_TAPICERIA_Y_FUNDAS, 'LINOS PARA TAPICERIA Y FUNDAS'),
        (PANAS_LISAS_Y_TEXTURADAS, 'PANAS LISAS Y TEXTURADAS'),
        (OUTDOOR, 'OUTDOOR (USO EXTERIOR)'),
        (SIMIL_CUERO, 'SIMIL CUERO'),
        (JAQUARDS, 'JAQUARDS DE 1,40 Y  2,80 DE ANCHO'),
        (ESTAMPADOS, 'ESTAMPADOS'),
        (CHENILES, 'CHENILES'),
    )

    _code = models.CharField('Código', max_length=4, null=True, blank=True, unique=True, db_index=True)
    _name = models.CharField('Nombre', max_length=80, null=True, blank=True)
    _price = models.DecimalField('Costo de la tela', max_digits=10, decimal_places=2, blank=True, null=True)
    _category = models.CharField('Categoría', max_length=250, choices=CATEGORY_OPTIONS, null=True, blank=True)
    _description_width = models.DecimalField('Descripción ancho', max_digits=10, decimal_places=2, blank=True,
                                             null=True)

    def __str__(self):
        return f'{self.name()}'

    @classmethod
    def new_from(cls, code, name, price, category, description_width):
        fabric = cls(_code=code, _name=name, _price=price, _category=category, _description_width=description_width)
        fabric.save()
        return fabric

    @classmethod
    def update_price(cls, code, name, price, category, description_width):
        fabric = cls.objects.filter(_code=int(code))
        if fabric:
            fabric._price = price
            fabric._name = name
        else:
            fabric = cls.new_from(code, name, price, category, description_width)
        return fabric

    def code(self):
        return self._code

    def name(self):
        return self._name

    def price(self):
        return self._price

    def category(self):
        return self._category

    def description(self):
        return self._description

    def description_width(self):
        return self._description_width

    class Meta:
        verbose_name = 'Tela'
        verbose_name_plural = 'Telas'
