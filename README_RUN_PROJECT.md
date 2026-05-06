HOW TO RUN CAMPUSCART

1. Install Node.js.
2. Install MongoDB Community Server.
3. Make sure MongoDB is running locally.

After unzipping the project, open Terminal.

Go inside the project:

cd template-code

Install backend:

cd backend
npm install

Install frontend:

cd ../frontend
npm install

The .env file is already included in the main template-code folder.
Do not move it into backend.

Run backend in one Terminal:

cd template-code/backend
npm run server

If that does not work, try:

npm start

Run frontend in another Terminal:

cd template-code/frontend
npm run dev

Open the frontend link shown in Terminal.
Usually it is:

http://localhost:5173

Important:
MongoDB must be running locally or login/register/products/database features will not work.
