import codecs
import csv
from decimal import Decimal

from core.models.fabric import Fabric

def import_csv_data(archivo_csv):
    reader = csv.reader(codecs.iterdecode(archivo_csv, 'utf-8'))
    # next(reader)  # Saltar la primera fila (cabecera del archivo CSV)

    for row in reader:
        try:
            _category, _code, _name, _description_width, _price, = row
            Fabric.update_price(code=_code, name=_name, price=Decimal(_price.replace('.', '').replace(',', '.')),
                                description_width=Decimal(_description_width.replace(',', '.')), category=_category)
            print(f'Datos cargados para {_name}')
        except Exception as e:
            print(f'Error al cargar la fila: {row}. Error: {e}')
