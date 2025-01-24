import subprocess

def process_3d_model(model_path: str, settings: dict) -> str:
    try:
        command = ["cura-engine", "slice", "-v", "-j", "path_to_settings.json", "-o", "output.gcode", "-l", model_path]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            return "output.gcode"
        else:
            print(result.stderr)
            return None
    except Exception as e:
        print(f"Error running CuraEngine: {e}")
        return None
