backend/
│── node_modules/
│── routes/
│   ├── authRoutes.js        # signup, login, logout
│   ├── imageRoutes.js       # generate image, fetch history
│   ├── userRoutes.js        # user profile, update info
│
│── controllers/
│   ├── authController.js    # handle auth logic
│   ├── imageController.js   # call AI API, save to DB
│   ├── userController.js    # manage user data
│
│── models/
│   ├── User.js              # Sequelize/Prisma/Postgres user schema
│   ├── Prompt.js
│   ├── Image.js
│   ├── Token.js
│
│── middleware/
│   ├── authMiddleware.js    # JWT auth, session handling
│
│── config/
│   ├── db.js                # PostgreSQL connection
│   ├── cloud.js             # if saving images to cloud (S3, Cloudinary)
│
│── utils/
│   ├── hash.js              # password hashing
│   ├── jwt.js               # token generation/verification
│
│── .env                     # API keys, DB creds
│── package.json
│── server.js                # Express server entry
