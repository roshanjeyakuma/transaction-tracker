from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend running"}), 200


@app.route("/")
def ui():
    return render_template("index.html")


def get_db():
    return mysql.connector.connect(
        host="127.0.0.1",     # use IP, not localhost
        user="root",
        password="Rosh@n1890",
        database="accounting_app",
        port=3306
    )

# -------------------- GET ALL TRANSACTIONS --------------------
@app.route("/transactions", methods=["GET"])
def get_transactions():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM transactions"
    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data), 200

# -------------------- GET SINGLE TRANSACTION --------------------
@app.route("/transactions/<int:id>", methods=["GET"])
def get_transaction(id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM transactions WHERE id=%s", (id,))
    data = cursor.fetchone()

    cursor.close()
    conn.close()

    if not data:
        return jsonify({"error": "Transaction not found"}), 404

    return jsonify(data), 200

# -------------------- ADD TRANSACTION --------------------
@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.json

    if data["amount"] <= 0:
        return jsonify({"error": "Amount must be positive"}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO transactions (description, amount, type, category, transaction_date)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["description"],
        data["amount"],
        data["type"],
        data.get("category"),
        data["transaction_date"]
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Transaction added"}), 201

# -------------------- UPDATE TRANSACTION --------------------
@app.route("/transactions/<int:id>", methods=["PUT"])
def update_transaction(id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE transactions
        SET description=%s, amount=%s, type=%s, category=%s, transaction_date=%s
        WHERE id=%s
    """, (
        data["description"],
        data["amount"],
        data["type"],
        data.get("category"),
        data["transaction_date"],
        id
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Transaction updated"}), 200

# -------------------- DELETE TRANSACTION --------------------
@app.route("/transactions/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM transactions WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Transaction deleted"}), 200

# -------------------- SUMMARY --------------------
@app.route("/summary", methods=["GET"])
def summary():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type='income'")
    income = cursor.fetchone()[0] or 0

    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type='expense'")
    expense = cursor.fetchone()[0] or 0

    cursor.close()
    conn.close()

    return jsonify({
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense
    }), 200

if __name__ == "__main__":
    app.run(port=5050, debug=True)
