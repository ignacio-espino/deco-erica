from typing import Type

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.commands.base import Command
from core.commands.commands import ByPassCommand
from core.orderings.base import CollectionOrdering, ByPassOrdering
from core.paginators.base import Paginator, ByPassPaginator
from core.presenters.base import Presenter


class Endpoint(APIView):
    """
    Todo: only GET and POST are defined. PUT, PATCH, etc are not implemented, do it if you need to
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        result = self._get_command(request_data=request.GET).execute()
        presented_result = self._present_result(result)
        return Response(data=presented_result, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        result = self._post_command(post_data=request.data).execute()
        presented_result = self._present_result(result)
        return Response(data=presented_result, status=status.HTTP_200_OK)

    def _get_command(self, request_data) -> Command:
        # override this method if the endpoint is a GET request
        return ByPassCommand()

    def _post_command(self, post_data) -> Command:
        # override this method if the endpoint is a POST request
        return ByPassCommand()

    def _present_result(self, result):
        return {
            'success': result.is_successful(),
            'data': self._get_data_from_result(result),
            'errors': result.errors(),
        }

    def _get_data_from_result(self, result):
        data = result.get_object()
        ordered_data = self._get_ordering(request_data=self.request.GET).order(data)
        paginated_data = self._get_paginator(request_data=self.request.GET).paginate(ordered_data)
        presented_data = self._get_presenter().for_this(paginated_data).present()
        return presented_data

    def _get_ordering(self, request_data) -> CollectionOrdering:
        return ByPassOrdering()

    def _get_paginator(self, request_data) -> Paginator:
        return ByPassPaginator()

    def _get_presenter(self) -> Type[Presenter]:
        return Presenter
