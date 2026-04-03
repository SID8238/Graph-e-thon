# Backend_Server/decryptor.py

from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

KEY = b'12345678901234567890123456789012'  # 32 bytes
IV = b'1234567890123456'                 # 16 bytes

def decrypt_packet(encrypted_data):
    try:
        decoded = base64.b64decode(encrypted_data)

        cipher = AES.new(KEY, AES.MODE_CBC, IV)
        decrypted = unpad(cipher.decrypt(decoded), AES.block_size)

        return decrypted.decode('utf-8')

    except Exception as e:
        raise Exception(f"Decryption failed: {str(e)}")