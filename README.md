##  My cloud app

# Деплой проекта на сервер

1. Арендуем сервер на РЕГ.ru и подключаемся к нему через ssh;
   > ssh root@89.104.68.178

2. Создаём пользователя:
   > adduser username

   и присваиваем пользователю права администратора:
   > usermod username -aG sudo
   
   переключаемся на пользователя:
   > su username

3. Создаём рабочую директорию проекта;
   > mkdir dir_name

4. > sudo apt update

5. Устанавливаем зависимости для серверной части: 
   > sudo apt install python-venv python-pip postgresql nginx gunicorn;

   Запускаем nginx сервер;
   > sudo systemctl start nginx

6. Устанавливаем зависимости для фронтенда:
    - установка nvm: 
      > curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

    - копируем, вставляем и нажимаем enter следующей части, полученной после предыдущего шага:
       > export NVM_DIR="$HOME/.nvm"
       [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
       [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    - установка node:
      > nvm install node 21.7.1

    - установка yran:
      > npm install -g yarn

7. Настраиваем базу данных:
   > sudo su postgres

   > psql

   > ALERT USER postgres WITH PASSWORD 'your_password' 
   
   > CREATE DATABASE database_name

8. Клонируем репозиторий проекта на github в директорию проекта на сервере:
    > git clone https://github.com/Nikolaytcev/FPY_DIPLOMA_MY_CLOUD.git;

9. Создаём виртуальное окружение:
   > python3 -m -venv env

10. Активируем виртуальное окружение:
   > source env/bin/activate

11. Переходим в папку проекта и устанавливаем необходимые библиотеки из файла requirements.txt:
   > pip install -r requirements.txt

12. Применяем миграции БД:
   > python manage.py migrate

13. Переходим в папку *frontend* внутри папки проекта и устанавливаем необходимые зависимости:
   > yarn install

14. В этой же директрии создаём файл .env:
   > nano .env
   
   Заносим туда наименование сервера (первая часть URL запроса):
   > VITE_BASE_URL = 'http://IP:8000'

15. Производим сборку фронтендовой части:
   > yarn build

16. Внутри папки проекта создаём файл .env:
   > nano .env

   Заносим туда следующие переменные:
   > SECRET_KEY=your_secret_key
   > 
   > NAME_DB=your_db_name
   > 
   > USER=postgres
   > 
   > DEBUG=True
   > 
   > HOST=127.0.0.1
   > 
   > HOSTS=89.104.68.178,
   > 
   > PORT=5432
   > 
   > CSRF=http://89.104.68.178,
   > 
   > CORS=http://89.104.68.178, http://*.localhost,
   > 
   > PASSWORD=your_password

17. В файле *./frontend/dist/index.html* загружаем *static* и указываем для файлов .js и .css 
      полный путь их расположения в папке */static/*

18. Производим сборку статических файлов:
   > python manage.py collectstatic

19. Первый запуск проекта:
   > python manage.py runserver 0.0.0.0:8000

## Настройка *nginx* и *gunicorn*

### Настройка *gunicorn*

Файл сокета:

> sudo nano /etc/systemd/system/gunicorn.socket
>
> [Unit]
> 
> Description=gunicorn socket
>
> [Socket]
>
> ListenStream=/run/my_cloud.sock
>
> [Install]
> 
> WantedBy=sockets.target

Файл сервиса:

> sudo nano /etc/systemd/system/gunicorn.service
> 
> [Unit]
>
>Description=gunicorn deamon
>
>Requires=gunicorn.socket
>
>After=network.target
>
> [Service]
>
>User=nikolay
>
>Group=www-data
>
>WorkingDirectory=/home/nikolay/work/FPY_DIPLOMA_MY_CLOUD
>
>ExecStart=/home/nikolay/work/FPY_DIPLOMA_MY_CLOUD/env/bin/gunicorn \
>
>--access-logfile - \
>
>--workers 3 \
>
>--bind unix:/run/my_cloud.sock \
>
>my_cloud.wsgi:application
>
> [Install]
> 
> WantedBy=multi-user.target

Запускаем и активируем *gunicorn*
> sudo systemctl start gunicorn.socket
>
> sudo systemctl enable gunicorn.socket

Проверяем наличие файла .sock
> file /run/gunicorn.sock

Проверяем статус
>sudo systemctl status gunicorn.socket
 
Установливаем соединение с сокетом через curl.
>  curl --unix-socket /run/sock_file.sock localhost

Проверяем статус gunicorn
> sudo systemctl status gunicorn

Должо быть:
> Active: active (running)

### Настраиваем *nginx*

>sudo nano /etc/nginx/sites-available/project_name
>
> server {
> 
> listen 80;
> 
> server_name 89.104.68.178;
>
> location = /favicon.ico { access_log off; log_not_found off; }
>
> location /static/ {
> 
> alias /home/username/dir_name/project_name;}
>
> location /media/ {
> 
> alias /home/username/dir_name/project_name;}
>
> location / {
> 
> include proxy_params;
> 
> proxy_pass http://unix:/run/sock_file.sock; }
> 
> }

Перезапускаем nginx:
> sudo systemctl restart nginx
>
> sudo ufw allow 'Nginx Full'

## Отчёт по выполненному ТЗ

В приложении осуществлено:
   - регистрация пользователя согласно требованиям к имени и паролю;
   - аутентификация и авторизация пользователя;
   - загрузка файлов на диск и отображение загруженных файлов согласно требованиям ТЗ;
   - загрузка удаление, изменение названия и комментария к файлу;
   - формирование ссылки для скачивания файла;
   - у пользователя с правами администратора доступен список пользователей и их файлы, с которыми
      можно проводить все вышеперечисленные операции, за исключением добавления файлов.

Проблемы по приложению:
   - название файла должно содержать только латинские буквы без пробелов и спец. символов;
   - ссылка на скачивание файла формируется как запрос Django, то есть, ссылка не содержит в себе никакой
      информации по файлу, а только id файла, кодировка не присутствует (не получилось разобраться с этим вопросом)

Проблемы по серверной части:
   - nginx работает, но по статическим файлам получаю ошибку **403 Forbidden**. 
      Пробовал устанавливать доступ к папкам 755 и файлам 644, менял строку **user** в *nginx.conf* - не помогло.
      Проблема остаётся актуальной.
   - CORS, судя по ошибке, нужно использовать протокол HTTPS, а не HTTP.
   - Копирование ссылки для скачивания файла в модальном окне работает только для локальной машины,
      как я понял, связано это тоже с HTTPS, так как HTTP - не безопасен.








    

