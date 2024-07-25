import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from stockfish import Stockfish, StockfishException
from threading import Lock

class StockFishServer:
    def __init__(self, config):
        self.config = config
        self.server_config = config['server_config']
        self.stock_fish_config = config['stock_fish_config']
        
        self.stock_fish = self.get_stock_fish(self.stock_fish_config)

        self.host = self.server_config['host']
        self.port = self.server_config['port']

        self.lock = Lock()

        self.app = Flask(__name__)
        self.app.add_url_rule('/best_move', view_func=self.best_move, methods=['POST'])
        CORS(self.app)

    def run(self):
        self.app.run(host = self.host, port=self.port)
    
    @staticmethod
    def get_stock_fish(config) -> Stockfish:
        return Stockfish(
            path=config['path'], 
            depth=config['depth'], 
            parameters= {
                'Threads': config['threads'], 
                'Minimum Thinking Time': config['minimum_thinking_time']
            }
        )
    
    def stock_fish_best_move(self, fen):
        try:
            self.stock_fish.set_fen_position(fen)
            move = self.stock_fish.get_top_moves(1)[0]
            print(move)
            return move, None
        except StockfishException:
            self.stock_fish = self.get_stock_fish(self.stock_fish_config)
            return None, 'illegal_move'

    def best_move(self):
        data = request.get_json()
        fen = data.get('fen', None)
        if 'fen' is None or not self.stock_fish.is_fen_valid(fen):
            return jsonify({'error': f'No valid FEN provided: {fen}'}), 400
        
        with self.lock:
            best_move, error_msg = self.stock_fish_best_move(fen)
            if best_move is not None and error_msg is None:
                return jsonify({'bestmove': best_move['Move'], 'mate': best_move['Mate']}), 200
            else:
                return jsonify({'bestmove': error_msg}), 200


def main(config):
    with open(config, 'rb') as f:
        config = json.load(f)
    stock_fish_server = StockFishServer(config)
    stock_fish_server.run()

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='')
    parser.add_argument('-c', '--config', type=str, help='path to the server_config.json', default='./local_configs/local_server_config.json')
    args = parser.parse_args()

    main(args.config)
