from core.models.sale import Sale


class DecoErica:

    def convert_to_sale(self, quotation):
        sale_number = Sale.objects.count() + 1
        return Sale(_quote=quotation, _number=sale_number)
