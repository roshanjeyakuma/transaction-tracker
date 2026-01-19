import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5050";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
    category: "",
    transaction_date: "",
  });

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");


  /* ---------------- FETCH DATA ---------------- */

  const fetchTransactions = async () => {
    const res = await fetch(`${API}/transactions`);
    const data = await res.json();
    setTransactions(data);
  };

  const fetchSummary = async () => {
    const res = await fetch(`${API}/summary`);
    const data = await res.json();
    setSummary(data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  /* ---------------- FORM HANDLING ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.amount || !form.transaction_date) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      // UPDATE
      await fetch(`${API}/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      setEditingId(null);
    } else {
      // ADD
      await fetch(`${API}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
    }

    setForm({
      description: "",
      amount: "",
      type: "income",
      category: "",
      transaction_date: "",
    });

    fetchTransactions();
    fetchSummary();
  };

  /* ---------------- DELETE ---------------- */

  const deleteTransaction = async (id) => {
    await fetch(`${API}/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
    fetchSummary();
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setForm({
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      transaction_date: tx.transaction_date.split("T")[0],
    });
  };

  /* ---------------- UI ---------------- */

  const filteredTransactions = transactions.filter((t) => {
  const typeMatch =
    filterType === "all" ? true : t.type === filterType;

  const categoryMatch =
    filterCategory === ""
      ? true
      : (t.category || "")
          .toLowerCase()
          .includes(filterCategory.toLowerCase());

  return typeMatch && categoryMatch;
});

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>💰 Transaction Tracker</h1>

        {/* SUMMARY */}
        <div style={styles.summaryBox}>
          <div>
            <h3>Income</h3>
            <p style={{ color: "green" }}>₹ {summary.total_income}</p>
          </div>
          <div>
            <h3>Expense</h3>
            <p style={{ color: "red" }}>₹ {summary.total_expense}</p>
          </div>
          <div>
            <h3>Balance</h3>
            <p style={{ color: "#333" }}>₹ {summary.balance}</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />

          <input
            name="transaction_date"
            type="date"
            value={form.transaction_date}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Transaction" : "Add Transaction"}
          </button>
        </form>

        <h3>Filters</h3>

<div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="all">All</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <input
    placeholder="Filter by category"
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  />
</div>


        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (

              <tr key={t.id}>
                <td>{t.description}</td>
                <td>₹ {t.amount}</td>
                <td style={{ color: t.type === "income" ? "green" : "red" }}>
                  {t.type}
                </td>
                <td>{t.category}</td>
                <td>{t.transaction_date}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Edit</button>{" "}
                  <button onClick={() => deleteTransaction(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "900px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  summaryBox: {
    display: "flex",
    justifyContent: "space-around",
    background: "#f4f6ff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default App;
