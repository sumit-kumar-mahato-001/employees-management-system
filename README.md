# Employee Information Management System

A complete college project built with HTML, CSS, JavaScript, Node.js, Express.js, EJS, and MySQL.

## Features

- Admin login and logout
- Dashboard employee/department totals
- Add employee
- View employee records
- Search by employee ID or employee name
- Update employee
- Delete employee with confirmation
- Add/view/delete departments
- JavaScript form validation
- MySQL database
- Responsive interface

## Requirements

- Node.js
- MySQL

## Installation

1. Open MySQL and run `database.sql`.
2. Copy `.env.example` to `.env`.
3. Enter your MySQL credentials in `.env`.
4. Open a terminal in the project folder.
5. Run:

   npm install

6. Create/reset the default admin with:

   node scripts/createAdmin.js admin admin123

7. Start the project:

   npm start

8. Open `http://localhost:3000`.

## Default Login

Username: admin
Password: admin123

## Project Structure

- `server.js` - main Express application
- `config/` - MySQL configuration
- `middleware/` - login protection
- `routes/` - application routes and database operations
- `views/` - EJS frontend pages
- `public/` - CSS and JavaScript
- `scripts/` - admin creation utility
- `database.sql` - database tables and sample departments

## Note

For reliable login setup, run the `createAdmin.js` command after importing the SQL file. It generates a valid bcrypt password hash for the selected password.
