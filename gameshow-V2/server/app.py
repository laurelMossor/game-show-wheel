#!/usr/bin/env python3
"""
Game Show Application - Main Entry Point
Runs the Flask server for the game show interface
"""

from flask import Flask, render_template, jsonify, request
from game_state import GameState
from wheel_logic import WheelLogic
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'game-show-secret-key-2024'

# Initialize game components
game_state = GameState()
wheel_logic = WheelLogic()

@app.route('/')
def score_display():
    """Main score display interface"""
    return render_template('scores.html', 
                         players=game_state.get_players(),
                         scores=game_state.get_scores())

@app.route('/wheel')
def wheel_interface():
    """Spinning wheel interface"""
    return render_template('wheel.html')

@app.route('/api/scores')
def get_scores():
    """API endpoint to get current scores"""
    return jsonify({
        'players': game_state.get_players(),
        'scores': game_state.get_scores()
    })

@app.route('/api/scores/update', methods=['POST'])
def update_score():
    """API endpoint to update player scores"""
    data = request.get_json()
    player_id = data.get('player_id')
    points = data.get('points', 0)
    
    if player_id is not None:
        game_state.update_score(player_id, points)
        return jsonify({'success': True, 'scores': game_state.get_scores()})
    
    return jsonify({'success': False, 'error': 'Invalid player_id'}), 400

@app.route('/api/wheel/spin', methods=['POST'])
def spin_wheel():
    """API endpoint to spin the wheel"""
    result = wheel_logic.spin()
    return jsonify({
        'success': True,
        'result': result,
        'segment': wheel_logic.get_current_segment()
    })

@app.route('/api/wheel/segments')
def get_wheel_segments():
    """API endpoint to get wheel configuration"""
    return jsonify({
        'segments': wheel_logic.get_segments(),
        'current_segment': wheel_logic.get_current_segment()
    })

if __name__ == '__main__':
    # Development mode
    print("🎮 Starting Game Show Server...")
    print("📊 Score tracking available at: http://localhost:5001")
    print("🎯 Spinning wheel available at: http://localhost:5001/wheel")
    print("⌨️  Press Ctrl+C to stop the server")
    app.run(host='0.0.0.0', port=5001, debug=True)
else:
    # Production mode
    app.run(host='0.0.0.0', port=5001, debug=False)
