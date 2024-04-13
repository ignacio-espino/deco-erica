import codecs
import csv
from decimal import Decimal

from core.models.fabric import Fabric


# class Command(BaseCommand):
#     help = 'Carga datos desde un archivo CSV a tu modelo de Django'
#
#     def add_arguments(self, parser):
#         parser.add_argument('csv_file', type=str, help='Ruta del archivo CSV')
#
#     def handle(self, *args, **kwargs):
#         csv_file = kwargs['csv_file']
#
#         if not os.path.isfile(csv_file):
#             self.stdout.write(self.style.ERROR('El archivo CSV no existe'))
#             return
#
#         with open(csv_file, 'r') as csvfile:
#             reader = csv.reader(csvfile)
#             # next(reader)  # Saltar la primera fila (cabecera del archivo CSV)
#
#             for row in reader:
#                 try:
#                     _code, _price, _name = row
#                     Fabric.update_price(code=_code, name=_name, price=_price)
#                     self.stdout.write(self.style.SUCCESS(f'Datos cargados para {_name}'))
#                 except Exception as e:
#                     self.stdout.write(self.style.ERROR(f'Error al cargar la fila: {row}. Error: {e}'))


def import_csv_data(csv_file):
    reader = csv.reader(codecs.iterdecode(csv_file, 'utf-8'))
    # next(reader)  # Saltar la primera fila (cabecera del archivo CSV)

    for row in reader:
        try:
            _category, _code, _name, _description_width, _price, = row
            Fabric.update_price(code=_code, name=_name, price=Decimal(_price.replace(',', '')),
                                description_width=Decimal(_description_width.replace(',', '.')), category=_category)
            print(f'Datos cargados para {_name}')
        except Exception as e:
            print(f'Error al cargar la fila: {row}. Error: {e}')
