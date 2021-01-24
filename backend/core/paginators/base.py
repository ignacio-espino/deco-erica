class Paginator:
    def __init__(self, page=0, results_per_page=0) -> None:
        self._page = page
        self._results_per_page = results_per_page

    def paginate(self, data):
        raise NotImplementedError


class ByPassPaginator(Paginator):
    def paginate(self, data):
        return data


class CollectionPaginator(Paginator):
    def paginate(self, data):
        return self._paginate_collection(data)

    def _paginate_collection(self, collection):
        lower_index = self._results_per_page * self._page
        upper_index = self._results_per_page * (self._page + 1)
        return collection[lower_index:upper_index]
