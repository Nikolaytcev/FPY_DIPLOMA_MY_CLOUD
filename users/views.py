from django.contrib.auth import authenticate, login, logout
from django.template.defaultfilters import filesizeformat
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from cloud.models import Files
from .forms import RegisterForm
from .models import CustomUser

from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def list(self, request, *args, **kwargs):
        users = CustomUser.objects.all()
        users_list = []
        for i in users:
            files = Files.objects.filter(user=i.id)
            users_list.append({'id': i.id,
                               'username': i.username,
                               'first_name': i.first_name,
                               'last_name': i.last_name,
                               'email': i.email,
                               'is_staff': i.is_staff,
                               'is_active': i.is_active,
                               'files': len(files),
                               'size': filesizeformat(sum([i.file.size for i in files]))
                               })
        return Response({'users': users_list})


class RegViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        user_form = RegisterForm(data=request.data)
        if serializer.is_valid():
            if user_form.is_valid():
                new_user = user_form.save(commit=False)
                new_user.set_password(user_form.cleaned_data['password'])
                new_user.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return Response({'isauthenticated': False})
    return Response({'isauthenticated': True})


@api_view(('GET',))
def whoami_view(request):
    if not request.user.is_authenticated:
        return Response({'isauthenticated': False})
    if request.user.is_staff:
        user_status = 'admin'
    else:
        user_status = 'user'

    return Response({'isauthenticated': True,
                     'id': request.user.id,
                     'username': request.user.username,
                     'status': user_status})


@api_view(['POST'])
def login_view(request):
    data = request.data
    if request.method == 'POST':
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_staff:
                return Response({'id': user.id, 'status': 'admin', 'username': user.username},
                                status=status.HTTP_201_CREATED)
            return Response({'id': user.id, 'status': 'user', 'username': user.username},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_403_FORBIDDEN)


@api_view(('PUT',))
def delete_view(request):
    if request.user.is_authenticated and request.user.is_staff:
        data = request.data
        user_id = data['userId']
        user = CustomUser.objects.filter(id__exact=user_id)[0]
        if user.is_active:
            user.is_active = False
            user.save()
            return Response({'status': 'User is not active'}, status=status.HTTP_200_OK)
        user.is_active = True
        user.save()
        return Response({'status': 'User is active'}, status=status.HTTP_200_OK)
    return Response({'status': 'User is not admin'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
def admin_status_view(request):
    if request.user.is_authenticated and request.user.is_staff:
        data = request.data
        user_id = data['userId']
        user = CustomUser.objects.filter(id__exact=user_id)[0]
        if user.is_staff:
            user.is_staff = False
            user.save()
            return Response({'status': 'User is not staff'}, status=status.HTTP_200_OK)
        user.is_staff = True
        user.save()
        return Response({'status': 'User is staff'}, status=status.HTTP_200_OK)
    return Response({'status': 'User is not admin'}, status=status.HTTP_403_FORBIDDEN)


@api_view(('GET',))
def logout_view(request):
    if not request.user.is_authenticated:
        return Response({'status': 'You are not logged in'}, status=status.HTTP_403_FORBIDDEN)
    logout(request)
    return Response({'status': 'Successfully logged out!'}, status=status.HTTP_200_OK)
