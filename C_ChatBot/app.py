from flask import Flask, render_template, request, jsonify
from fuzzywuzzy import process

app = Flask(__name__)

def read_conversation_pairs(file_path):
    conversations = {}
    with open(file_path, 'r') as file:
        lines = file.read().split('\n\n\n')  
        for line in lines:
            parts = line.split('####', 1)  
            if len(parts) == 2:
                user_input = parts[0].strip().lower()  
                bot_response = parts[1].strip()  
                conversations[user_input] = bot_response.split('\n')  
    return conversations

# Chatbot function
def chatbot_response(user_input, chat_pairs):
    closest_match, similarity = process.extractOne(user_input, list(chat_pairs.keys()))

    # Threshold value
    if similarity >= 80:  
        return chat_pairs[closest_match]
    else:
        return ["Sorry, I don't have a response for that."]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    file_path = 'C:\\Users\\Icon\\Desktop\\C_ChatBot\\CodeDataset.txt'
    chat_pairs = read_conversation_pairs(file_path)
    bot_response = chatbot_response(user_input.lower(), chat_pairs)
    return jsonify({'bot_response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
