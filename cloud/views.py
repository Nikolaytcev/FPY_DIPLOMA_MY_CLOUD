import datetime
import mimetypes
import os
import random
from wsgiref.util import FileWrapper
from django.http import StreamingHttpResponse
from django.template.defaultfilters import filesizeformat
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from cloud.models import Files
from cloud.permissions import isMyPermissionClass
from my_cloud.settings import BASE_URL


def to_encode_link():
    CHARACTERS = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz234567890!$%&@'
    encode_link = ''.join([random.choice(CHARACTERS) for _ in range(30)])
    return encode_link


class CloudViewSet(ModelViewSet):
    permission_classes = [isMyPermissionClass]

    def list(self, request, *args, **kwargs):
        user_id = request.GET.get('id')
        data = Files.objects.filter(user_id=user_id)
        files = []

        for file in data:
            files.append({'id': file.id,
                          'name': file.name,
                          'size': file.size,
                          'created_at': file.create_date,
                          'last_load': file.load_date,
                          'comment': file.comment,
                          'path': file.file.path,
                          'link': '',
                          'user': file.user.id})
        return Response({'data': files})


@api_view(('DELETE',))
def delete_file_view(request):
    file_id = request.GET.get('id')
    file = Files.objects.get(id=file_id)
    if request.user.is_authenticated and request.user == file.user or request.user.is_staff:
        file.file.delete(save=True)
        file.delete()
        return Response({'status': 'file deleted'}, status=status.HTTP_204_NO_CONTENT)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)


@api_view(('PUT',))
def change_file_view(request):
    file_id = request.GET.get('id')
    file = Files.objects.get(id=file_id)
    if request.user.is_authenticated and request.user == file.user or request.user.is_staff:
        data = request.data
        load_date = data.get('loadTime', 0)
        if load_date == 0:
            name = data['name']
            comment = data['comment']
            file.comment = comment
            file.name = name
        else:
            file.load_date = data['loadTime']
        file.save()
        return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)


@api_view(('POST',))
def cloud_view(request):
    if request.user.is_authenticated:
        file = request.FILES.get('file')
        comment = request.POST.get('comment')
        size = filesizeformat(file.size)
        name = file
        user = request.user
        Files.objects.create(
            file=file,
            name=name,
            size=size,
            create_date=datetime.datetime.now(),
            comment=comment,
            user=user
        )
        return Response({'file': name, 'size': size, 'user': user.id, 'comment': comment},
                        status=status.HTTP_201_CREATED)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)


@api_view(('GET',))
def download_file_view(request, download):
    file = Files.objects.get(link=download)
    filepath = file.file.path
    file = filepath
    filename = os.path.basename(file)
    chunk_size = 8192
    response = StreamingHttpResponse(FileWrapper(open(file, 'rb'), chunk_size),
                                     content_type=mimetypes.guess_type(file)[0])
    response['Content-Length'] = os.path.getsize(file)
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    return response


class ShareViewSet(ModelViewSet):

    def list(self, request, *args, **kwargs):
        file_id = request.GET.get('id')
        file = Files.objects.get(id=file_id)
        if request.user.is_authenticated and request.user == file.user or request.user.is_staff:
            link = to_encode_link()
            file.link = link
            file.save()
            return Response({'url': BASE_URL + link})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)
