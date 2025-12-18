from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/matches', methods=['GET'])
def matches():
    sample = [
        {"id": 1, "title": "Partido prueba", "video_path": "uploads/sample.mp4"},
        {"id": 2, "title": "Partido demo", "video_path": "uploads/sample2.mp4"}
    ]
    return jsonify(sample)


@app.route('/api/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    return jsonify({"id": match_id, "title": f"Match {match_id}", "video_path": "uploads/sample.mp4"})


@app.route('/api/matches/<int:match_id>/events', methods=['GET'])
def get_events(match_id):
    events = [
        {"id": 1, "timestamp": 10, "player": {"id": 1, "name": "Pérez"}, "event_type": "Pase", "x": 30, "y": 40},
        {"id": 2, "timestamp": 25, "player": {"id": 2, "name": "Gómez"}, "event_type": "Tiro", "x": 70, "y": 10}
    ]
    return jsonify(events)


@app.route('/api/matches/<int:match_id>/lineup', methods=['GET'])
def get_lineup(match_id):
    lineup = [
        {"player": {"id": 1, "name": "Pérez"}},
        {"player": {"id": 2, "name": "Gómez"}}
    ]
    return jsonify(lineup)


@app.route('/api/matches', methods=['POST'])
def create_match():
    # aceptar form-data u json
    title = request.form.get('title') or (request.json and request.json.get('title'))
    return jsonify({"id": 999, "title": title or "uploaded", "video_path": "uploads/ok.mp4"}), 201


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
