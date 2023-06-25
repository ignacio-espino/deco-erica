from django.test import TestCase

from core.models.customer import Customer


class CustomerTest(TestCase):

    def test_can_create_a_costumer(self):
        customer = Customer.new_from(full_name='Tomas Falabella', cell_number=1234, address='Carlos casares 444',
                                     email='tomasfalabella@gmail.com')

        self.assertIsNotNone(customer)
