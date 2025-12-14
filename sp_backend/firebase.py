# app/core/firebase.py
import firebase_admin
from firebase_admin import credentials

def init_firebase():
  if not firebase_admin._apps:
    cred = credentials.Certificate("stockypocky-firebase-adminsdk-fbsvc-e07e197faa.json")
    firebase_admin.initialize_app(cred)