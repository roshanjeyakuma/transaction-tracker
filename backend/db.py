import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mysql@123",   # your MySQL password
        database="accounting_app"
    )
