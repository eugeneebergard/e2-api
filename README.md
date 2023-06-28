# E2-api

## Инициализация и сборка

```
# установка пакетов
$ npm install

# сборка с локальным сервером
$ npm run start
# сборка с локальным сервером и hot reload
$ npm run dev
```

## Models

### Поля схемы `user`

- **email** — почта пользователя, по которой он регистрируется. Это обязательное поле, уникальное для каждого пользователя. Также оно валидируется на соответствие схеме электронной почты.
- **password** — хеш пароля. Обязательное поле-строка. База данных не возвращает это поле.
- **name** — имя пользователя, например: Александр или Мария. Это обязательное поле-строка от 2 до 30 символов.

### Поля схемы `article`

- **keyword** — ключевое слово, по которому статью нашли. Обязательное поле-строка.
- **title** — заголовок статьи. Обязательное поле-строка.
- **text** — текст статьи. Обязательное поле-строка.
- **date** — дата статьи. Обязательное поле-строка.
- **source** — источник статьи. Обязательное поле-строка.
- **link** — ссылка на статью. Обязательное поле-строка. URL-адрес.
- **image** — ссылка на иллюстрацию к статье. Обязательное поле-строка. URL-адрес.
- **owner** — \_id пользователя, сохранившего статью. База данных не возвращает это поле.

## Routes and Controllers

- `GET /users/me` Возвращает информацию о пользователе. **Требуется авторизация**
```typescript
const response = { 
    user: { 
        email: '' as string,
        name: '' as string
    }
}
```

- `PUT /users/me` Редактирует информацию о пользователе и возвращает новые данные. **Требуется авторизация**
```typescript
const payload = {
    email: '' as string,
    name: '' as string,
    password: '' as string | undefined
}

const response = { 
    user: { 
        email: '' as string,
        name: '' as string
    }
}
```

- `GET /articles` Возвращает все сохранённые пользователем статьи. **Требуется авторизация**
```typescript
const response = { 
    articles: [{
        keyword: '' as string,
        title: '' as string,
        text: '' as string,
        date: '' as string,
        source: '' as string,
        link: '' as string,
        image: '' as string
    }]
}
```

- `POST /articles` Сохраняет статью в профиль пользователя. **Требуется авторизация**
```typescript
const payload = {
    keyword: '' as string,
    title: '' as string,
    text: '' as string,
    date: '' as string,
    source: '' as string,
    link: '' as string,
    image: '' as string
}
```

- `DELETE /articles/:articleId` Удаляет сохранённую статью по _id. **Требуется авторизация**
```typescript
const response = { message: '' as string }
```

- `POST /signup` Создаёт пользователя с переданными в теле `email, password, name`
```typescript
const payload = {
    name: '' as string,
    email: '' as string,
    password: '' as string,
}
const response = {
    user: {
        email: '' as string,
        name: '' as string
    }
}
```

- `POST /signin` Проверяет переданные в теле почту и пароль и возвращает JWT.
```typescript
const payload = {
    email: '' as string,
    password: '' as string,
}
const response = { message: '' as string }
```

- `POST /logout` Чистит jwt cookie клиента.
```typescript
const response = { isAuth: false as boolean }
```

- `GET /check-user` Проверяет авторизован ли пользователь.
```typescript
const response = { isAuth: false as boolean }
```


## Logs

- `request.log` - хранит информацию о всех запросах к API
- `error.log` - хранит информацию об ошибках, которые возвращало API
