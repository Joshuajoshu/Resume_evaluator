from flask import Flask, jsonify, request
from flask_cors import CORS
from gemini_util import get_gemini_pro_response
import PyPDF2


from pymongo import MongoClient


app = Flask(__name__)
CORS(app) 

@app.route("/resume_eval", methods=['POST'])
def generate_evaluation():
    client=MongoClient('mongodb://localhost:27017/')
    db=client['Resume_evaluator']
    collection=db['history']
    prompt = """
            Hey Act Like a skilled or very experience ATS(Application Tracking System) with a deep understanding of tech field,
            software engineering, data science, data analyst and big data engineer. Your task is to evalutate the resume based 
            on the job description.
            You must consider the job market is very competitive and you should provide best assistance for improving their
            resumes. Assign the percentage Matching based on Jd and the missing keywords with high accuracy
            description: {jd}
            Resume-text : {text}
            I want the response in one single string having the data below of job description match should be shown with the symbol "%"
             and all the missing key words in the array format and the evaluation  and profile summary
           highlight the sideheading with bold 
        """
    try:
        data = request.json
        pdf_data = data.get('pdf_data')
        jd=data.get('job_description')
        mail=data.get('mail')
        input_prompt_format = prompt.format(jd=jd,text=pdf_data)
        response = get_gemini_pro_response(input_prompt_format)

        entry={
            "mail":mail,
            "job_description":jd,
            'response':response
        }
        collection.insert_one(entry)
        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/register', methods = ['POST'])
def register():
    client=MongoClient('mongodb://localhost:27017/')
    db=client['Resume_evaluator']
    collection=db['users']
    name=request.json['name']
    email = request.json['email']
    password = request.json['password']

    user_data={
        'name':name,
        'email':email,
        'password':password
    }

    try:
        check = collection.find_one({'email':email})
        if (check):
            return jsonify({"success": "Exist"})
        else:
            collection.insert_one(user_data)
            return jsonify({"success": "Registered"})
    except Exception as e:
        return jsonify({"success": str(e)})

    return jsonify({"success": name})

@app.route("/login", methods=['POST'])
def login():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['Resume_evaluator']
    collection = db['users']
    data = request.json
    email=data.get('email')
    password=data.get('password')
    user_data={
        'email':email,
        'password':password
    }
    user = collection.find_one({'email': email, 'password': password})
    if user:
        return jsonify({"name": user.get('name'),"stat":"login successfull"})
    else:
        return jsonify({"name": "no name", "stat":"False"})

@app.route("/get_chat_history", methods=['POST'])
def get_chat_history():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['Resume_evaluator']
    collection = db['history']
    data = request.json
    mail=data.get('mail')
    chat_history = list(collection.find({'mail':mail}, {'_id': 0}))
    return jsonify(chat_history)

@app.route('/extract_text', methods=['POST'])
def extract_text():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf_file']
    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        return jsonify({'text': text}), 200
    else:
        return jsonify({'error': 'Invalid file format'}), 400
    
if __name__ == "__main__":
    app.run(host='192.168.1.5',port=5000,debug=True)
