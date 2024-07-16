from django.contrib.auth.models import AbstractUser, User
from django.core.validators import RegexValidator
from django.db import models


username_validator = RegexValidator(regex='^[a-zA-z]([a-zA-Z]|[0-9]){3,20}$',
                                    message='Ваш логин не удовлетворяет требованиям: Логин — только латинские буквы и '
                                            'цифры, первый символ — буква, длина от 4 до 20 символов',
                                    code='no match')

password_validator = RegexValidator(regex='(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}',
                                    message='Ваш пароль не удовлетворяет требованиям: Пароль — не менее 6 символов: '
                                            'как минимум одна заглавная буква, одна цифра и один специальный символ.',
                                    code='no match')


class CustomUser(AbstractUser):
    username = models.CharField(max_length=20, validators=[username_validator], unique=True)
    password = models.CharField(max_length=150, validators=[password_validator])
    email = models.EmailField(blank=True, unique=True)
    full_name = models.CharField(max_length=50, default='')
    path = models.CharField(max_length=500, default=f'/{User.username}')

    def __str__(self):
        return self.username
