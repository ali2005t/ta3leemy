import os
import shutil
import subprocess
import re
from PIL import Image

class BuilderLogic:
    def __init__(self, root_dir):
        # root_dir is "g:\edu acdemy"
        self.root_dir = root_dir
        self.mobile_path = os.path.join(root_dir, "mobile_app_template")
        self.windows_path = os.path.join(root_dir, "windows_app_template")

    def log(self, message, callback=None):
        print(message)
        if callback:
            callback(message)

    def update_config_file(self, project_path, app_name, start_url):
        config_path = os.path.join(project_path, "lib", "config.dart")
        
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Update App Name
        content = re.sub(r'static const String appName = ".*?";', f'static const String appName = "{app_name}";', content)
        
        # Update Start URL
        content = re.sub(r'static const String startUrl = ".*?";', f'static const String startUrl = "{start_url}";', content)

        with open(config_path, "w", encoding="utf-8") as f:
            f.write(content)

    def update_pubspec_name(self, project_path, app_name):
        # Simple sanitization for pubspec name (lowercase, underscores only)
        safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', app_name.lower())
        pubspec_path = os.path.join(project_path, "pubspec.yaml")

        with open(pubspec_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        with open(pubspec_path, "w", encoding="utf-8") as f:
            for line in lines:
                if line.strip().startswith("name:"):
                    f.write(f"name: ta3leemy_{safe_name}\n")
                else:
                    f.write(line)

    def replace_logo(self, project_path, logo_path):
        target_dir = os.path.join(project_path, "assets", "images")
        os.makedirs(target_dir, exist_ok=True)
        target_file = os.path.join(target_dir, "logo.png")
        
        # Resize/Copy logic could go here, for now direct copy
        shutil.copy(logo_path, target_file)
        
        # Also need to update Windows icon if applicable
        if "windows_app_template" in project_path:
             icon_dir = os.path.join(project_path, "windows", "runner", "resources")
             # Convert png to ico? For now just warning or skip if not ico
             # Ideally user provides an ICO for windows or we convert using PIL
             pass

    def run_flutter_command(self, project_path, command, callback=None):
        try:
            process = subprocess.Popen(
                command,
                cwd=project_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True,
                text=True
            )
            
            # Read output in real-time
            for line in process.stdout:
                self.log(line.strip(), callback)
            
            process.wait()
            if process.returncode != 0:
                err = process.stderr.read()
                self.log(f"Error: {err}", callback)
                return False
            return True
        except Exception as e:
            self.log(f"Exception: {e}", callback)
            return False

    def build_android_apk(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Android APK Build for {teacher_name}...", callback)
        
        # 1. Generate Icons
        self.run_flutter_command(self.mobile_path, "flutter pub run flutter_launcher_icons", callback)
        
        # 2. Build
        success = self.run_flutter_command(self.mobile_path, "flutter build apk --release", callback)
        
        if success:
            src = os.path.join(self.mobile_path, "build", "app", "outputs", "flutter-apk", "app-release.apk")
            dst = os.path.join(output_dir, f"{teacher_name}.apk")
            shutil.copy(src, dst)
            self.log(f"✅ APK Saved to: {dst}", callback)
        else:
            self.log("❌ APK Build Failed", callback)

    def build_android_bundle(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Android Bundle Build...", callback)
        success = self.run_flutter_command(self.mobile_path, "flutter build appbundle --release", callback)
        
        if success:
            src = os.path.join(self.mobile_path, "build", "app", "outputs", "bundle", "release", "app-release.aab")
            dst = os.path.join(output_dir, f"{teacher_name}.aab")
            shutil.copy(src, dst)
            self.log(f"✅ AAB Saved to: {dst}", callback)

    def build_windows_exe(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Windows Build...", callback)
        success = self.run_flutter_command(self.windows_path, "flutter build windows --release", callback)
        
        if success:
            # Copy the entire Release folder
            src_dir = os.path.join(self.windows_path, "build", "windows", "runner", "Release") # Check path logic again later if needed
            # Find the actual release folder (x64 often involved)
            pass 
            # Logic to find where it is exactly (found in previous turn: build/windows/x64/runner/Release)
            final_src = os.path.join(self.windows_path, "build", "windows", "x64", "runner", "Release")
            
            dst_dir = os.path.join(output_dir, f"{teacher_name}_Windows")
            if os.path.exists(dst_dir):
                shutil.rmtree(dst_dir)
            shutil.copytree(final_src, dst_dir)
            
            # Rename exe inside
            old_exe = os.path.join(dst_dir, "ta3leemy_windows_app.exe")
            new_exe = os.path.join(dst_dir, f"{teacher_name}.exe")
            if os.path.exists(old_exe):
                os.rename(old_exe, new_exe)
                
            self.log(f"✅ Windows Build Saved to: {dst_dir}", callback)

