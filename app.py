from flask import Flask, request, render_template, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a real secret key

def get_db_connection():
    conn = sqlite3.connect('ctf_challenges.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    challenges = conn.execute('SELECT * FROM challenges').fetchall()
    conn.close()
    points = session.get('points', 0)
    logged_in = 'username' in session
    return render_template('index.html', challenges=challenges, points=points, logged_in=logged_in)

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    session['username'] = username
    session['points'] = 0  # Initialize points for new users
    return redirect(url_for('index'))

@app.route('/submit_flag', methods=['POST'])
def submit_flag():
    flag = request.form['flag']
    challenge_id = request.form['challenge_id']
    conn = get_db_connection()
    challenge = conn.execute('SELECT * FROM challenges WHERE id = ?', (challenge_id,)).fetchone()
    conn.close()

    if flag == challenge['flag']:
        # Award points
        current_points = session.get('points', 0)
        new_points = current_points + challenge['points']
        session['points'] = new_points
        return "CONGRATULATIONS!!!!"
    else:
        return "Incorrect flag, try again."

if __name__ == '__main__':
    app.run(debug=True)
