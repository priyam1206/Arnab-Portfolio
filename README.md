# Arnab Portfolio (Flask Submission)

## Project Structure

```
.
+-- app.py
+-- messages.db
+-- requirements.txt
+-- .gitignore
+-- static/
¦   +-- css/
¦   ¦   +-- style.css
¦   +-- js/
¦       +-- script.js
+-- templates/
    +-- index.html
    +-- messages.html
```

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   `pip install -r requirements.txt`
3. Run the app:
   `python app.py`

## URLs

- Home: `http://127.0.0.1:5000/`
- Messages: `http://127.0.0.1:5000/messages`
- API Portfolio: `http://127.0.0.1:5000/api/portfolio`
- API Contact (POST): `http://127.0.0.1:5000/api/contact`

## Notes

- `messages.db` is SQLite storage for contact messages.
- The app auto-creates the `messages` table at startup if it does not exist.
- Frontend is split for submission: HTML templates, CSS, and JS are separated.
