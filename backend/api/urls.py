from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]


# WARNING: this seems to be a bad idea, has many security problems
urlpatterns += [
    re_path(r'^media-backend/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]
