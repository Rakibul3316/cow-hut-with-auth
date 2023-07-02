# Digital Cow Hut

Live link: https://cow-hut-with-auth.onrender.com/

Application routes

## Main part

Auth (User)

- Route: https://cow-hut-with-auth.onrender.com/api/auth/login (POST)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/auth/signup (POST)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/auth/refresh-token (POST)

Auth (Admin)

- Route: https://cow-hut-with-auth.onrender.com/api/v1/admins/create-admin (POST)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/admins/login (POST)

User

- Route: https://cow-hut-with-auth.onrender.com/api/v1/users (GET) Include an id that is saved in your database
- Route: https://cow-hut-with-auth.onrender.com/api/v1/users/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- Route: https://cow-hut-with-auth.onrender.com/api/v1/users/6177a5b87d32123f08d2f5d4 (PATCH) Include an id that is saved in your database
- Route: https://cow-hut-with-auth.onrender.com/api/v1/users/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

Cows

- Route: https://cow-hut-with-auth.onrender.com/api/v1/cows (POST)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/cows (GET)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/cows/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- Route: https://cow-hut-with-auth.onrender.com/api/v1/cows/6177a5b87d32123f08d2f5d4 (PATCH) Include an id that is saved in your database
- Route: https://cow-hut-with-auth.onrender.com/api/v1/cows/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

Orders

- Route: https://cow-hut-with-auth.onrender.com/api/v1/orders (POST)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/orders (GET)

## Bonus Part

Admin

-Route: https://cow-hut-with-auth.onrender.com/api/v1/admins/create-admin (POST)

My Profile

- Route: https://cow-hut-with-auth.onrender.com/api/v1/users/my-profile (GET)
- Route: https://cow-hut-with-auth.onrender.com/api/v1/users/my-profile (PATCH)

Order:

- Route: https://cow-hut-with-auth.onrender.com/api/v1/orders/6177a5b87d32123f08d2f5d4 (GET)