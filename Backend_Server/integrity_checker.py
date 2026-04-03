# Backend_Server/integrity_checker.py

import json
import hashlib

def verify_integrity(decrypted_json):
    try:
        data = json.loads(decrypted_json)

        payload = data["data"]
        salt = data["salt"]
        received_hash = data["hash"]

        combined = json.dumps(payload) + str(salt)

        calculated_hash = hashlib.sha512(combined.encode()).hexdigest()

        return calculated_hash == received_hash

    except Exception as e:
        return False