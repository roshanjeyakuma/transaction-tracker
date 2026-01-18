from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "HOME WORKS"

@app.route("/test", methods=["POST"])
def test():
    return "TEST ROUTE WORKS"

if __name__ == "__main__":
    print(">>> FLASK ROUTES REGISTERED <<<")
    print(app.url_map)   # THIS IS THE KEY LINE
    app.run(debug=False)  # disable reloader completely
