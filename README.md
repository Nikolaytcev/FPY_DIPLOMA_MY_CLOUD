##  My cloud app

# Деплой проекта на сервер

1. Арендуем сервер на РЕГ.ru и подключаемся к нему через ssh;
   >ssh root@89.104.68.178

2. Создаём пользователя:
   >adduser username

   и присваиваем пользователю права администратора:
   >usermod username -aG sudo
   
   переключаемся на пользователя:
   >su username

3. Создаём рабочую директорию проекта;
   >mkdir dirname

4. >sudo apt update

5. Устанавливаем зависимости для серверной части: 
   >sudo apt install python-venv python-pip postgresql nginx gunicorn;

   Запускаем nginx сервер;
   > sudo systemctl start nginx

6. Устанавливаем зависимости для фронтенда:
    - установка nvm: 
      >curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

    - копируем, вставляем и нажимаем enter следующей части, полученной после предыдущего шага:
       >export NVM_DIR="$HOME/.nvm"
       [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
       [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    - установка node:
      >nvm install node 21.7.1

    - установка yran:
      >npm install -g yarn

7. Настраиваем базу данных:
   >sudo su postgres

   >psql

   >ALERT USER postgres WITH PASSWORD 'your_password' 
   
   >CREATE DATABASE database_name

8. Клонируем репозиторий проекта на github в директорию проекта на сервере:
    >git clone https://github.com/Nikolaytcev/FPY_DIPLOMA_MY_CLOUD.git;

9. Создаём виртуальное окружение:
   >python3 -m -venv env

10. Активируем виртуальное окружение:
   >source env/bin/activate

11. Переходим в папку проекта и устанавливаем необходимые библиотеки из файла requirements.txt:
   >pip install -r requirements.txt

12. Применяем миграции БД:
   >python manage.py migrate

13. Переходим в папку *frontend* внутри папки проекта и устанавливаем необходимые зависимости:
   >yarn install

14. В этой же директрии создаём файл .env:
   >nano .env
   
   Заносим туда наименование сервера (первая часть URL запроса):
   >VITE_BASE_URL = 'http://89.104.68.178:8000'

15. Производим сборку фронтендовой части:
   >yarn build

16. Внутри папки проекта создаём файл .env:
   >nano .env

   Заносим туда следующие переменные:
   >SECRET_KEY=your_secret_key
   > 
   >NAME_DB=your_db_name
   > 
   >USER=postgres
   > 
   >DEBUG=True
   > 
   >HOST=127.0.0.1
   > 
   >HOSTS=89.104.68.178,
   > 
   >PORT=5432
   > 
   >CSRF=http://89.104.68.178,
   > 
   >CORS=http://89.104.68.178, http://*.localhost,
   > 
   >PASSWORD=your_password

17. Производим сборку статических файлов:
   >python manage.py collectstatic

18. Первый запуск проекта:
   >python manage.py runserver 0.0.0.0:8000

## Настройка *ginx* и *gunicorn*

### Настройка *gunicorn*

   >sudo nano /etc/systemd/system/gunicorn.service
> 
> 



    

