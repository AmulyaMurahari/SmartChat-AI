from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS

# Define the Ollama endpoint and model
OLLAMA_ENDPOINT = 'http://localhost:11434'
MODEL_NAME = 'gemma:2b'

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.json
        message = data['text']
        logging.debug(f"Received message: {message}")
        
        response = requests.post(
            f"{OLLAMA_ENDPOINT}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": message
            }
        )
        response.raise_for_status()
        
        # Log the raw response text
        raw_response_text = response.text
        logging.debug(f"Raw response text: {raw_response_text}")
        
        # Parse the NDJSON response
        responses = []
        for line in raw_response_text.strip().split('\n'):
            responses.append(json.loads(line))
        
        # Combine the 'response' fields from each JSON object
        combined_response = ''.join([resp.get('response', '') for resp in responses])
        
        return jsonify({"response": combined_response.strip()})
    
    except requests.exceptions.RequestException as e:
        logging.error(f"RequestException: {e}")
        return jsonify({"error": str(e)}), 500
    
    except json.JSONDecodeError as e:
        logging.error(f"JSONDecodeError: {e}")
        logging.error(f"Response text causing JSON error: {raw_response_text}")
        return jsonify({"error": "Invalid JSON response from the server"}), 500
    
    except Exception as e:
        logging.error(f"Exception: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
