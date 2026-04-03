import subprocess
from logger import log_event

def trigger_kill_switch():
    print("[ALERT] KILL SWITCH ACTIVATED")
    log_event("KILL_SWITCH", "System halted due to integrity failure")

    # Call Node alert system
    subprocess.run(["node", "../Cloud_Functions/alert_trigger.js"])