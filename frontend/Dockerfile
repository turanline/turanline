# Используйте официальный образ Node.js версии 18 в качестве базового образа
FROM node:18

# Установите рабочую директорию в контейнере
WORKDIR /app

# Скопируйте package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Установите все зависимости проекта
RUN npm install

# Скопируйте весь исходный код в рабочую директорию
COPY . .

# Соберите проект
RUN npm run build

# Откройте порт, на котором будет работать ваше приложение
EXPOSE 3000

# Определите команду запуска вашего приложения
CMD ["npm", "start"]
