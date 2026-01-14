import os
import shutil
import subprocess
import re
from PIL import Image
import datetime

class BuilderLogic:
    def __init__(self, root_dir):
        # root_dir is "g:\edu acdemy"
        self.root_dir = root_dir
        self.mobile_path = os.path.join(root_dir, "mobile_app_template")
        self.windows_path = os.path.join(root_dir, "windows_app_template")
        self.iscc_path = r"C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

    def log(self, message, callback=None):
        print(message)
        if callback:
            callback(message)

    def check_prerequisites(self, callback=None):
        missing = []
        # Check Flutter
        if shutil.which("flutter") is None:
            missing.append("Flutter SDK (Add to PATH)")
        
        # Check Inno Setup
        if not os.path.exists(self.iscc_path):
            missing.append("Inno Setup Compiler (Install from jrsoftware.org)")

        if missing:
            self.log("❌ Missing Prerequisites:", callback)
            for m in missing:
                self.log(f"   - {m}", callback)
            return False
        return True

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
        # Note: We keep the main package name for consistency, just update description if needed
        # But actually modifying the package 'name' field in pubspec often breaks imports.
        # It's safer to only update description and version.
        pass

    def update_version(self, project_path, version):
        pubspec_path = os.path.join(project_path, "pubspec.yaml")
        if not os.path.exists(pubspec_path):
            return

        # Normalize version to x.y.z
        parts = version.split('.')
        while len(parts) < 3:
            parts.append('0')
        clean_version = ".".join(parts)

        with open(pubspec_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        with open(pubspec_path, "w", encoding="utf-8") as f:
            for line in lines:
                if line.strip().startswith("version:"):
                    f.write(f"version: {clean_version}+1\n")
                elif "flutter_launcher_icons_windows" in line: # Cleanup old if present
                   continue
                else:
                    f.write(line)

    def replace_logo(self, project_path, logo_path):
        target_dir = os.path.join(project_path, "assets", "images")
        os.makedirs(target_dir, exist_ok=True)
        target_file = os.path.join(target_dir, "logo.png")
        shutil.copy(logo_path, target_file)

        # For Windows, we use flutter_launcher_icons
        if "windows_app_template" in project_path:
             self._generate_windows_icons(project_path)

    def _generate_windows_icons(self, project_path):
        # 1. Ensure pubspec has the config
        # We need to inject ios: false to prevent errors
        pubspec_path = os.path.join(project_path, "pubspec.yaml")
        with open(pubspec_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Check if flutter_launcher_icons is present, if not add it
        if "flutter_launcher_icons:" not in content:
            new_config = """
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: false
  ios: false
  image_path: "assets/images/logo.png"
  web:
    generate: true
    image_path: "assets/images/logo.png"
    background_color: "#hex_code"
    theme_color: "#hex_code"
  windows:
    generate: true
    image_path: "assets/images/logo.png"
    icon_size: 48
  macos:
    generate: false
    image_path: "assets/images/logo.png"
"""
            # Append or insert 
            if "dev_dependencies:" in content:
                 # Replace existing dev_dependencies with itself + new config
                 # Simple append for now is risky if indentation differs. 
                 # Safer: Append to end if not present? 
                 # Let's just append to the file end, yaml allows multiple docs but better to be safe.
                 # Assuming standard template structure.
                 with open(pubspec_path, "a", encoding="utf-8") as f:
                     f.write(new_config)
            else:
                 # Should not happen in our template
                 pass
        
        # 2. Run Generation
        self.log("🎨 Generating Windows Icons (This might take a moment)...")
        # Run pub get first
        self.run_flutter_command(project_path, "flutter pub get")
        self.run_flutter_command(project_path, "dart run flutter_launcher_icons")

    def update_android_basics(self, project_path, app_name, package_name_suffix):
        # 1. Update Manifest Label
        manifest_path = os.path.join(project_path, "android", "app", "src", "main", "AndroidManifest.xml")
        if os.path.exists(manifest_path):
            with open(manifest_path, "r", encoding="utf-8") as f:
                content = f.read()
            content = re.sub(r'android:label=".*?"', f'android:label="{app_name}"', content)
            with open(manifest_path, "w", encoding="utf-8") as f:
                f.write(content)
        
        # 2. Update Application ID & NDK
        safe_suffix = re.sub(r'[^a-zA-Z0-9_]', '', package_name_suffix.lower())
        
        # Ensure it doesn't start with a digit or is empty
        if not safe_suffix:
            safe_suffix = "app"
        if safe_suffix[0].isdigit():
            safe_suffix = f"_{safe_suffix}"
            
        new_app_id = f"com.ta3leemy.{safe_suffix}"
        
        # Check for Kotlin DSL (.kts) first
        gradle_kts = os.path.join(project_path, "android", "app", "build.gradle.kts")
        gradle_groovy = os.path.join(project_path, "android", "app", "build.gradle")
        
        target_path = None
        is_kotlin = False
        
        if os.path.exists(gradle_kts):
            target_path = gradle_kts
            is_kotlin = True
        elif os.path.exists(gradle_groovy):
            target_path = gradle_groovy
            is_kotlin = False
            
        if target_path:
            with open(target_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if is_kotlin:
                # Kotlin DSL: applicationId = "..."
                content = re.sub(r'applicationId\s*=\s*"[^"]+"', f'applicationId = "{new_app_id}"', content)
                
                # NDK Fix
                if "ndk" not in content and "defaultConfig" in content:
                    ndk_fix = 'ndk { debugSymbolLevel = "SYMBOL_TABLE" }\n        '
                    content = content.replace("defaultConfig {", "defaultConfig {\n        " + ndk_fix)
            else:
                # Groovy DSL: applicationId "..."
                content = re.sub(r'applicationId\s+"[^"]+"', f'applicationId "{new_app_id}"', content)
                
                # NDK Fix
                if "ndk" not in content and "defaultConfig" in content:
                    ndk_fix = 'ndk { debugSymbolLevel "SYMBOL_TABLE" }\n        '
                    content = content.replace("defaultConfig {", "defaultConfig {\n        " + ndk_fix)
            
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(content)

    def update_windows_basics(self, project_path, app_name):
        # Update Runner.rc for File Description / Product Name in Explorer
        rc_path = os.path.join(project_path, "windows", "runner", "Runner.rc")
        if os.path.exists(rc_path):
             content = ""
             encoding_used = "utf-8"
             try:
                 with open(rc_path, "r", encoding="utf-8") as f:
                     content = f.read()
             except UnicodeDecodeError:
                 try:
                     with open(rc_path, "r", encoding="utf-16") as f:
                         content = f.read()
                         encoding_used = "utf-16"
                 except Exception as e:
                     print(f"Error reading Runner.rc: {e}")
                     return

             content = content.replace("ta3leemy_windows_app", app_name)
             
             with open(rc_path, "w", encoding=encoding_used) as f:
                 f.write(content)

    def run_flutter_command(self, project_path, command, callback=None):
        try:
            process = subprocess.Popen(
                command,
                cwd=project_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True,
                text=True,
                encoding="utf-8",
                errors="replace"
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

    def find_file(self, root, extension):
        for dirpath, dirnames, filenames in os.walk(root):
            for filename in filenames:
                if filename.endswith(extension):
                    return os.path.join(dirpath, filename)
        return None

    def build_android_apk(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Android APK Build for {teacher_name}...", callback)
        
        # 1. Generate Icons
        self.run_flutter_command(self.mobile_path, "flutter pub run flutter_launcher_icons", callback)
        
        # 2. Build
        success = self.run_flutter_command(self.mobile_path, "flutter build apk --release", callback)
        
        if success:
            # Try specific path first, then search
            src = os.path.join(self.mobile_path, "build", "app", "outputs", "flutter-apk", "app-release.apk")
            if not os.path.exists(src):
                 src = self.find_file(os.path.join(self.mobile_path, "build"), ".apk")
            
            if src and os.path.exists(src):
                dst = os.path.join(output_dir, f"{teacher_name}.apk")
                shutil.copy(src, dst)
                self.log(f"✅ APK Saved to: {dst}", callback)
            else:
                self.log("⚠️ APK built but file not found!", callback)
        else:
            self.log("❌ APK Build Failed", callback)

    def build_android_bundle(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Android Bundle Build...", callback)
        success = self.run_flutter_command(self.mobile_path, "flutter build appbundle --release", callback)
        
        if success:
            src = os.path.join(self.mobile_path, "build", "app", "outputs", "bundle", "release", "app-release.aab")
            if not os.path.exists(src):
                 src = self.find_file(os.path.join(self.mobile_path, "build"), ".aab")

            if src and os.path.exists(src):
                dst = os.path.join(output_dir, f"{teacher_name}.aab")
                shutil.copy(src, dst)
                self.log(f"✅ AAB Saved to: {dst}", callback)
            else:
                self.log("⚠️ AAB built but file not found!", callback)
        else:
            self.log("❌ AAB Build Failed", callback)

    def deep_clean_project(self, callback=None):
        self.log("🧹 Starting Deep Clean...", callback)
        paths_to_clean = [
            os.path.join(self.mobile_path, "build"),
            os.path.join(self.mobile_path, ".dart_tool"),
            os.path.join(self.mobile_path, "android", ".gradle"),
            os.path.join(self.windows_path, "windows", "flutter", "ephemeral")
        ]
        
        for path in paths_to_clean:
            if os.path.exists(path):
                try:
                    self.log(f"   Deleting: {path}", callback)
                    if os.path.isfile(path):
                        os.remove(path)
                    else:
                        shutil.rmtree(path)
                except Exception as e:
                     self.log(f"   ⚠️ Could not delete {path}: {e}", callback)
        
        self.log("✨ Deep Clean Complete! (Next build will be slower but fresh)", callback)

    def create_installer(self, app_name, version, exe_dir, output_dir, callback=None):
        # exe_dir is where the built files are (e.g., .../runner/Release)
        exe_name = "sera.exe" # Fixed name as per CMake
        
        # Ensure we use a unique output filename to avoid Explorer Icon Cache issues
        # e.g., "AppName_Setup_v1.0.exe" -> "AppName_Setup_v1.1.exe" or timestamped
        # But user version input is best.
        
        iss_path = os.path.join(output_dir, "setup_script.iss")
        
        # Inno Setup Template
        # We assume the user has the logo.png copied to windows/runner/resources as app_icon.ico by now
        icon_path = os.path.join(self.windows_path, "windows", "runner", "resources", "app_icon.ico")
        
        iss_content = f"""
[Setup]
AppName={app_name}
AppVersion={version}
DefaultDirName={{autopf}}\\{app_name}
DefaultGroupName={app_name}
OutputDir={output_dir}
OutputBaseFilename={app_name}_Setup_v{version}
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest
SetupIconFile={icon_path}
DisableProgramGroupPage=yes

[Files]
Source: "{exe_dir}\\sera.exe"; DestDir: "{{app}}"; Flags: ignoreversion
Source: "{exe_dir}\\*"; DestDir: "{{app}}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{{autoprograms}}\\{app_name}"; Filename: "{{app}}\\{exe_name}"
Name: "{{autodesktop}}\\{app_name}"; Filename: "{{app}}\\{exe_name}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"

[Run]
Filename: "{{app}}\\{exe_name}"; Description: "Launch {app_name}"; Flags: nowait postinstall skipifsilent
"""
        with open(iss_path, "w", encoding="utf-8") as f:
            f.write(iss_content)
            
        # Run ISCC
        if os.path.exists(self.iscc_path):
            self.log("💿 Generating Installer (Setup.exe)...", callback)
            cmd = f'"{self.iscc_path}" "{iss_path}"'
            subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            installer_name = f"{app_name}_Setup_v{version}.exe"
            installer_path = os.path.join(output_dir, installer_name)
            
            if os.path.exists(installer_path):
                self.log(f"✅ Installer Created: {installer_path}", callback)
            else:
                 self.log(f"⚠️ Installer generation failed. Check script at {iss_path}", callback)
                 
            try:
                os.remove(iss_path) # Cleanup script
            except: 
                pass
        else:
            self.log("⚠️ Inno Setup Compiler not found. Skipping Installer.", callback)

    def build_windows_exe(self, output_dir, teacher_name, callback=None):
        self.log(f"🚀 Starting Windows Build for {teacher_name}...", callback)
        
        # 1. Clean previous symlinks/builds
        self.clean_windows_build()
        # Deep clean logic to ensure icon cache is cleared
        if os.path.exists(os.path.join(self.windows_path, "build")):
             shutil.rmtree(os.path.join(self.windows_path, "build"), ignore_errors=True)
        
        # 2. Config & Pub Get
        self.run_flutter_command(self.windows_path, "flutter pub get", callback)
        self.run_flutter_command(self.windows_path, "flutter config --enable-windows-desktop", callback)
        
        # 3. Build Release
        success = self.run_flutter_command(self.windows_path, "flutter build windows --release", callback)
        
        if success:
             # CMake handles renaming now, so we look for sera.exe
             build_dir = os.path.join(self.windows_path, "build", "windows", "x64", "runner", "Release")
             if not os.path.exists(build_dir):
                 # Fallback search if x64 is different or cmake change reverted
                 build_dir = self.find_dir_with_file(self.windows_path, "sera.exe")
                 if not build_dir:
                      build_dir = self.find_dir_with_file(self.windows_path, "ta3leemy_windows_app.exe")

             if build_dir and os.path.exists(build_dir):
                 # Create Output Folder
                 dst_dir = os.path.join(output_dir, f"{teacher_name}_Windows_Files")
                 if os.path.exists(dst_dir):
                     shutil.rmtree(dst_dir)
                 shutil.copytree(build_dir, dst_dir)
                 
                 self.log(f"✅ Windows Build Files Saved to: {dst_dir}", callback)
                 
                 # 4. Create Installer
                 # We need to parse version from pubspec or pass it
                 version = "1.0.0"
                 try:
                     with open(os.path.join(self.windows_path, "pubspec.yaml"), "r") as f:
                         for line in f:
                             if line.strip().startswith("version:"):
                                 version = line.split(":")[1].strip().split("+")[0]
                                 break
                 except: pass
                 
                 self.create_installer(teacher_name, version, dst_dir, output_dir, callback)
             else:
                 self.log("❌ Windows Build Succeeded but Output Not Found", callback)
        else:
             self.log("❌ Windows Build Failed", callback)

    def find_dir_with_file(self, root, filename):
        for dirpath, dirnames, filenames in os.walk(root):
            if filename in filenames:
                return dirpath
        return None

    def clean_windows_build(self):
        # Existing method to clean symlinks if present
        pass

