from typing import List


class CollectionOrdering:
    DoesNotExist = Exception

    @classmethod
    def all(cls) -> List['CollectionOrdering']:
        orderings = []
        for subclass in cls.__subclasses__():
            orderings.append(subclass())
        return orderings

    @classmethod
    def from_id(cls, order_id):
        for subclass in cls.__subclasses__():
            if str(subclass().id()) == str(order_id):
                return subclass()
        raise cls.DoesNotExist

    def id(self):
        return self.name()

    def name(self):
        """name must be unique"""
        raise NotImplementedError

    def order(self, collection):
        raise NotImplementedError


class ByPassOrdering(CollectionOrdering):
    def name(self):
        return 'Bypass'

    def order(self, collection):
        return collection
