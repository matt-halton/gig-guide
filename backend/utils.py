import os

def get_database_url(filename="app.db"):
    basedir = os.path.abspath(os.path.dirname(__file__))
    return f"sqlite:///{os.path.join(basedir, filename)}"