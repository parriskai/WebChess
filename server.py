from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="host", static_url_path="")

@app.route("/")
def index():
    return send_from_directory("host", "index.html")

if __name__ == "__main__":
    app.run(port=80)
