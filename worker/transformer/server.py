from flask import Flask, request
from sentence_transformers import SentenceTransformer

sentences = ["This is an example sentence", "Each sentence is converted"]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

app = Flask(__name__)

@app.route("/",methods=['POST'])
def hash():
    embeddings = model.encode(request.form["data"])
    return [embeddings.tolist()]