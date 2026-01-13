import customtkinter as ctk
import os
import threading
from tkinter import filedialog
from builder_logic import BuilderLogic

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class BuilderApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Ta3leemy App Builder 🚀")
        self.geometry("700x600")
        
import sys

# ... imports ...

class BuilderApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Ta3leemy App Builder 🚀")
        self.geometry("700x600")
        
        # Initialize Logic
        # Robust Path Detection for EXE vs Script
        if getattr(sys, 'frozen', False):
            # Running as EXE
            application_path = os.path.dirname(sys.executable)
        else:
            # Running as script
            application_path = os.path.dirname(os.path.abspath(__file__))
            
        # Try to find the templates. Logic:
        # 1. Check if we are in the root (next to mobile_app_template)
        # 2. Check if we are in builder_tool (up 1 level)
        # 3. Check if we are in dist (up 2 levels)
        
        possible_roots = [
            application_path,
            os.path.dirname(application_path),
            os.path.dirname(os.path.dirname(application_path))
        ]
        
        self.root_dir = application_path # Default fallback
        for path in possible_roots:
            if os.path.exists(os.path.join(path, "mobile_app_template")):
                self.root_dir = path
                break
        
        self.logic = BuilderLogic(self.root_dir)

        # UI Layout
        # ...
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(8, weight=1) # Log area expands

        self.create_widgets()

    def create_widgets(self):
        # 1. Title (Animated later)
        self.label_title = ctk.CTkLabel(self, text="Ta3leemy App Builder", font=("Roboto", 32, "bold"), text_color="#3B8ED0")
        self.label_title.grid(row=0, column=0, pady=(40, 10), padx=20, sticky="ew")
        self.label_subtitle = ctk.CTkLabel(self, text="Automated Build Tool 🚀", font=("Roboto", 14))
        self.label_subtitle.grid(row=1, column=0, pady=(0, 20), padx=20, sticky="n")

        # 2. App Name
        self.entry_name = ctk.CTkEntry(self, placeholder_text="اسم المدرس (App Name English)", height=40)
        self.entry_name.grid(row=2, column=0, pady=10, padx=60, sticky="ew")

        # 3. Web URL
        self.entry_url = ctk.CTkEntry(self, placeholder_text="رابط المنصة (Website URL)", height=40)
        self.entry_url.grid(row=3, column=0, pady=10, padx=60, sticky="ew")

        # 4. Pickers Frame
        self.frame_pickers = ctk.CTkFrame(self, fg_color="transparent")
        self.frame_pickers.grid(row=4, column=0, pady=10, padx=60, sticky="ew")
        
        self.btn_logo = ctk.CTkButton(self.frame_pickers, text="اختر اللوجو (Select Logo) 🖼️", command=self.select_logo, height=35)
        self.btn_logo.pack(side="left", expand=True, padx=5, fill="x")
        self.logo_path = None
        
        self.btn_output = ctk.CTkButton(self.frame_pickers, text="مكان الحفظ (Output Folder) 📂", command=self.select_output, fg_color="#2CC985", hover_color="#229A65", height=35)
        self.btn_output.pack(side="right", expand=True, padx=5, fill="x")
        self.output_path = os.path.join(self.logic.root_dir, "OUTPUTS") 

        # 5. Checkboxes
        self.frame_checks = ctk.CTkFrame(self, fg_color="transparent")
        self.frame_checks.grid(row=5, column=0, pady=10, padx=40)
        
        self.check_apk = ctk.CTkCheckBox(self.frame_checks, text="Android APK")
        self.check_apk.select()
        self.check_apk.pack(side="left", padx=15)
        
        self.check_aab = ctk.CTkCheckBox(self.frame_checks, text="Android Bundle")
        self.check_aab.pack(side="left", padx=15)
        
        self.check_win = ctk.CTkCheckBox(self.frame_checks, text="Windows EXE")
        self.check_win.pack(side="left", padx=15)

        # 6. Build Button & Progress
        self.btn_build = ctk.CTkButton(self, text="ابدأ البناء (Start Build) 🚀", command=self.start_build, height=50, font=("Roboto", 18, "bold"), fg_color="#1F6AA5", hover_color="#144870")
        self.btn_build.grid(row=6, column=0, pady=20, padx=60, sticky="ew")

        self.progress_bar = ctk.CTkProgressBar(self, mode="determinate", height=15)
        self.progress_bar.grid(row=7, column=0, pady=(0, 20), padx=60, sticky="ew")
        self.progress_bar.set(0)

        # 7. Log Area
        self.textbox_log = ctk.CTkTextbox(self, height=150, font=("Consolas", 12))
        self.textbox_log.grid(row=8, column=0, pady=(0, 20), padx=20, sticky="nsew")
        self.textbox_log.insert("0.0", "Logs will appear here...\n")
        
        # Start Animation
        self.after(100, self.animate_entrance)

    def animate_entrance(self):
        # A simple "Typewriter" or "Fade In" effect simulation
        title_text = "Ta3leemy App Builder"
        self.label_title.configure(text="")
        
        def type_writer(i=0):
            if i <= len(title_text):
                self.label_title.configure(text=title_text[:i])
                self.after(50, type_writer, i+1)
            else:
                self.label_subtitle.configure(text_color="#A0A0A0") # Fade in logic update color
                
        type_writer()

    def select_logo(self):
        file = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
        if file:
            self.logo_path = file
            self.btn_logo.configure(text=f"✅ Logo: {os.path.basename(file)}")

    def select_output(self):
        folder = filedialog.askdirectory()
        if folder:
            self.output_path = folder
            self.btn_output.configure(text=f"📂 Save to: {os.path.basename(folder)}")

    def log_message(self, msg):
        self.textbox_log.insert("end", msg + "\n")
        self.textbox_log.see("end")

    def start_build(self):
        # Validation
        name = self.entry_name.get().strip()
        url = self.entry_url.get().strip()
        
        if not name or not url:
            self.log_message("❌ Please enter App Name and URL!")
            return
            
        if not self.logo_path:
            self.log_message("⚠️ Warning: No Logo selected. Using default/existing logo.")
            
        # Run in thread
        self.btn_build.configure(state="disabled", text="Building... ⏳")
        self.progress_bar.set(0)
        t = threading.Thread(target=self.run_process, args=(name, url))
        t.start()

    def update_progress(self, val):
        self.progress_bar.set(val)

    def run_process(self, name, url):
        try:
            logic = self.logic
            total_steps = 5 # Config, Logo, APK, AAB, WIN
            current_step = 0
            
            self.log_message(f"📂 Project Root detected at: {logic.root_dir}")
            
            if not os.path.exists(os.path.join(logic.root_dir, "mobile_app_template")):
                 self.log_message("❌ ERROR: Could not find 'mobile_app_template'!")
                 self.log_message(f"Please place this tool in the folder: {logic.root_dir}")
                 self.btn_build.configure(state="normal", text="ابدأ البناء (Start Build) 🚀")
                 return

            # 1. Update Config (Mobile & Windows)
            self.log_message("⚙️ Updating Configuration...")
            logic.update_config_file(logic.mobile_path, name, url)
            logic.update_config_file(logic.windows_path, name, url)
            current_step += 1
            self.update_progress(current_step / total_steps)
            
            # 2. Update Logo
            if self.logo_path:
                self.log_message("🖼️ Updating Logo...")
                logic.replace_logo(logic.mobile_path, self.logo_path)
            
            current_step += 1
            self.update_progress(current_step / total_steps)
            
            # Ensure output dir exists
            os.makedirs(self.output_path, exist_ok=True)
            
            # 3. Android APK
            if self.check_apk.get():
                self.log_message("🤖 Building Android APK... (This may take a while)")
                # Indeterminate progress can be stimulated here by pulsing, but simple step is fine
                logic.build_android_apk(self.output_path, name, self.log_message)
            
            current_step += 1
            self.update_progress(current_step / total_steps)
                
            # 4. Android Bundle
            if self.check_aab.get():
                self.log_message("📦 Building Store Bundle... (This may take a while)")
                logic.build_android_bundle(self.output_path, name, self.log_message)
            
            current_step += 1
            self.update_progress(current_step / total_steps)
            
            # 5. Windows
            if self.check_win.get():
                self.log_message("🖥️ Building Windows EXE...")
                logic.build_windows_exe(self.output_path, name, self.log_message)
            
            current_step += 1
            self.update_progress(1.0) # 100%
                
            self.log_message("\n✨ ALL TASKS COMPLETED! ✨")
        except Exception as e:
            self.log_message(f"\n❌ CRITICAL ERROR: {e}")
            import traceback
            self.log_message(traceback.format_exc())
            self.progress_bar.configure(progress_color="red")
        finally:
            self.btn_build.configure(state="normal", text="ابدأ البناء (Start Build) 🚀")

if __name__ == "__main__":
    app = BuilderApp()
    app.mainloop()
