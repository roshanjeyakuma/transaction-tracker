TRANSACTION TRACKER APPLICATION

A full-stack Transaction Tracker web application that allows users to manage income and expenses, view summaries, and perform CRUD operations in real time.

--------------------------------------------------
FEATURES

Backend (Flask + MySQL):
- Add new transactions (Income / Expense)
- View all transactions
- Update existing transactions
- Delete transactions
- Real-time financial summary

Frontend (React):
- Clean and modern UI
- Form validation
- Add / Edit / Delete transactions
- Dynamic table rendering
- Summary dashboard

--------------------------------------------------
TECH STACK

Frontend:
- React
- JavaScript (ES6)
- Fetch API

Backend:
- Python
- Flask
- MySQL
- Flask-CORS

Database:
- MySQL

--------------------------------------------------
PROJECT STRUCTURE

transaction-tracker/
|
|-- backend/
|   |-- server.py
|
|-- frontend/
|   |-- src/App.js
|
|-- README.txt

--------------------------------------------------
BACKEND SETUP

1. Install dependencies:
pip install flask flask-cors mysql-connector-python

2. Start MySQL server (XAMPP or MySQL Server)

3. Create database and table:

CREATE DATABASE accounting_app;
USE accounting_app;

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255),
  amount DECIMAL(10,2),
  type ENUM('income', 'expense'),
  category VARCHAR(100),
  transaction_date DATE
);

4. Run backend:
python server.py

Backend URL:
http://127.0.0.1:5050

--------------------------------------------------
FRONTEND SETUP

1. Install dependencies:
npm install

2. Run React app:
npm start

Frontend URL:
http://localhost:3000

--------------------------------------------------
API ENDPOINTS

GET     /transactions
POST    /transactions
PUT     /transactions/:id
DELETE  /transactions/:id
GET     /summary

--------------------------------------------------
VALIDATION

- Amount must be greater than 0
- Required fields: Description, Amount, Date

--------------------------------------------------
AUTHOR

Roshan Jeyakumar
B.Tech – Artificial Intelligence & Data Science

--------------------------------------------------
NOTE

This project demonstrates real-world full stack development using Flask, React, and MySQL.
