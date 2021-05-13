# FaceSpace

## Links
- [Deployed API](https://rocky-beach-46261.herokuapp.com/)
- [FaceSpace Client Repository](https://github.com/banana-splits/FaceSpace-Client)
- [Deployed FaceSpace Client](https://banana-splits.github.io/FaceSpace-Client/#/)

## Planning Story
As a team we planned on working on a specific functionality each. Keeping track using a trello board. Problem solving issues were solved as a team whenever they arose.

## User Stories
As an unregistered user, I would like to sign up with email and password. \
As a registered user, I would like to sign in with email and password. \
As a signed in user, I would like to change password. \
As a signed in user, I would like to sign out. \
As a signed in user, I would like to add a post to my wall. \
As a signed in user, I would like to update a post on my wall. \
As a signed in user, I would like to delete a post on my wall. \
As a signed in user, I would like to see all my posts. \
As a signed in user, I would like to view a list of other users and view their walls.

## Technologies Used
- Node
- Express
- MongoDB
- Mongoose
- JavaScript

### Wireframes
![FaceSpace Wireframes](https://i.imgur.com/OLe30ou.png)

### ERD
![FaceSpace ERD](https://i.imgur.com/Qx7PBHx.png)

### Logo
![FaceSpace Logo](https://fontmeme.com/permalink/210510/98cb0c302b184f2a680b0459c1734bae.png)

# Routes

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |

#### POST /sign-up

Request:

```sh
curl --include --request POST https://mcdennis-post-board.herokuapp.com/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST https://mcdennis-post-board.herokuapp.com/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH https://mcdennis-post-board.herokuapp.com/change-password/ \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE https://mcdennis-post-board.herokuapp.com/sign-out/ \
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

### Posts

| Verb   | URI Pattern          | Controller#Action              |
|--------|----------------------|--------------------------------|
| POST   | `/posts`             | `users#Create Post`            |
| GET    | `/posts`             | `users#View All Posts`         |
| GET    | `/users/:userId`     | `users#View Posts By One User` |
| GET    | `/posts/:postId`     | `users#View One Post`          |
| PATCH  | `/posts/:id`         | `users#Update Post`            |
| DELETE | `/posts/:id`         | `users#Destroy Post`           |

#### POST /posts

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{
    "post": {
      "text": "Text Of The Post"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/posts/create.sh
```

Response:

```md
TP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"post":
  {
    "_id":"60988d0f7e39ba00153ea5d6",
    "text":"Text Of The Post",
    "owner":"60988ca97e39ba00153ea5d5",
    "ownerEmail":"an@example.email",
    "comments":[],
    "createdAt":"2021-05-10T01:31:59.280Z",
    "updatedAt":"2021-05-10T01:31:59.280Z",
    "__v":0
  }
}
```

#### GET /posts

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com" \
  --include \
  --request GET
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/posts/index.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"posts":
  [
    {
      "_id":"609bdcd2c23acd1c3c28ac8c",
      "text":"r",
      "owner":"60997e719523eb36eca8bce9",
      "ownerEmail":"cat@dog",
      "comments":[],
      "createdAt":"2021-05-12T13:49:06.426Z",
      "updatedAt":"2021-05-12T13:49:06.426Z",
      "__v":0
    },
    {
      "_id":"609bdcd8c23acd1c3c28ac8d",
      "text":"t",
      "owner":"60997e719523eb36eca7c9b1",
      "ownerEmail":"user@email",
      "comments":[],
      "createdAt":"2021-05-12T13:49:12.278Z",
      "updatedAt":"2021-05-12T13:49:12.278Z",
      "__v":0
    }
  ]
}
```

#### GET /users/:userId

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com/users/$USER_ID" \
  --include \
  --request GET
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa USER_ID=609be624c23acd1c3c28ac8f curl-scripts/users/show.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"posts":
  {
    [
      {
        "_id":"609be62bc23acd1c3c28ac90",
        "text":"hi",
        "owner":"609be624c23acd1c3c28ac8f",
        "ownerEmail":"blue@green",
        "comments":[],
        "createdAt":"2021-05-12T14:28:59.115Z",
        "updatedAt":"2021-05-12T14:28:59.115Z",
        "__v":0
      },
      {
        "_id":"609be62ec23acd1c3c28ac91",
        "text":"hello",
        "owner":"609be624c23acd1c3c28ac8f",
        "ownerEmail":"blue@green",
        "comments":[],
        "createdAt":"2021-05-12T14:29:02.857Z",
        "updatedAt":"2021-05-12T14:29:02.857Z",
        "__v":0
      }
    ]
  }
}
```

#### GET /posts/:postId

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com/$POST_ID" \
  --include \
  --request GET
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa POST_ID=609be62ec23acd1c3c28ac91 curl-scripts/posts/show.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "post":{
    "_id":"609be62ec23acd1c3c28ac91",
    "text":"hello",
    "owner":"609be624c23acd1c3c28ac8f",
    "ownerEmail":"blue@green",
    "comments":[],
    "createdAt":"2021-05-12T14:29:02.857Z",
    "updatedAt":"2021-05-12T14:29:02.857Z",
    "__v":0
  }
}
```

#### PATCH /posts/:postId

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com/$POST_ID" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{
      "post": {
        "text": "New Text"
      }
    }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa POST_ID=609be62ec23acd1c3c28ac91 curl-scripts/posts/update.sh
```

Response:

```md
TP/1.1 204 No Content
```

#### DELETE /posts/:id

Request:

```sh
curl "https://rocky-beach-46261.herokuapp.com/$POST_ID" \
  --include \
  --request DELETE
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa POST_ID=609be62ec23acd1c3c28ac91 curl-scripts/posts/destroy.sh
```

Response:

```md
TP/1.1 204 No Content
```

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
