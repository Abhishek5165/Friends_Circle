
# 😉 **Friends_Circle**  

### 🫣 **A Social Network Application** 🫂 

## 📖 **Description**  

Friends Circle is a cutting-edge social networking platform designed to bring people closer. With features like connecting, sending friend requests, and effortlessly managing friendships, it makes staying in touch simple and enjoyable. Built using **React**, **Node.js**, and **MongoDB**, Friends Circle combines a sleek, responsive design with robust functionality to deliver a dynamic user experience like never before. Dive in and redefine how you connect with the world!  

---

## 📂 **File Structure**  

### 🎨 **Frontend**  

```bash

frontend
├── dist
├── node_modules
├── src
│   ├── components
│   ├── context
│   ├── images
│   ├── pages
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts

```

### 🛠️ **Backend**  

```bash

server
├──cron
    └── cron.js
├── middleware
│   └── auth.js
├── models
│   └── User.js
├── routes
│   ├── auth.js
│   ├── friends.js
│   ├── users.js
│   └── index.js

```

### 🛠️ **Root**  

```bash

FRIENDS CIRCLE
├── Demo
├── frontend
├── node_modules
├── server
├── .env
├── .gitignore
├── package-lock.json
└── package.json

```
---

## 🖼️ **Project Preview**  


### 1️⃣ 🔐 **Login Page** 
![Login Page](https://github.com/Abhishek5165/Friends_Circle/blob/main/Demo/A.png)  

### 2️⃣ 🔐 **Signup Page** 
![Signup Page](https://github.com/Abhishek5165/Friends_Circle/blob/main/Demo/E.png)  

### 3️⃣ ✍️ **Dashboard Page**  
![Dashboard Page](https://github.com/Abhishek5165/Friends_Circle/blob/main/Demo/B.png)  

### 4️⃣ 🏠 **Friends Requests**  
![Home Page](https://github.com/Abhishek5165/Friends_Circle/blob/main/Demo/C.png)  

### 5️⃣ 🏠 **Friends 🫂**  
![Home Page](https://github.com/Abhishek5165/Friends_Circle/blob/main/Demo/D.png)  

---

## ⚙️ **Installation**   
 

1. Clone the repository:
   
   ```bash

   https://github.com/Abhishek5165/Friends_Circle.git

   ```  
2. Install dependencies:
   
   ```bash

   npm install

   ```  
3. Start the development server:
 
   ```bash

   npm run dev

   ```  
---

## ✨ **Features**  

- 🔒 **User Authentication and Authorization**  
- 🤝 **Friend Request System**  
- 🧑‍🤝‍🧑 **Friendship Management**  
- 🔍 **User Search and Filtering**  
- 📱 **Responsive Design**  

---

## 📡 **API Documentation**  

### 🔑 **Authentication**  

- `POST /api/auth/register`: Register a new user  
- `POST /api/auth/login`: Log in an existing user  

### 🤝 **Friends**  

- `POST /api/friends/request/:userId`: Send a friend request  
- `GET /api/friends/requests`: View pending requests  
- `PUT /api/friends/request/:userId`: Accept/Reject requests  
- `DELETE /api/friends/:userId`: Remove a friend  

### 👥 **Users**  

- `GET /api/users/search`: Search for users  
- `GET /api/users/friends`: View a user's friends    

---

### Show your support

Give a ⭐ if you like this website!

## Contact 🌟
If you have any query or feedback, feel free to reach out 💖:
- LinkedIn : https://www.linkedin.com/in/abhishek-verma-600899247/
- GitHub : https://github.com/Abhishek5165
