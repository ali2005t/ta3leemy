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
        
        # Initialize Logic
        # We assume the script is running inside 'builder_tool', so root is one level up
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.dirname(current_dir)
        self.logic = BuilderLogic(root_dir)

        # UI Layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(8, weight=1) # Log area expands

        self.create_widgets()

    def create_widgets(self):
        # 1. Title
        self.label_title = ctk.CTkLabel(self, text="Ta3leemy App Builder", font=("Roboto", 24, "bold"))
        self.label_title.grid(row=0, column=0, pady=20, padx=20, sticky="ew")

        # 2. App Name
        self.entry_name = ctk.CTkEntry(self, placeholder_text="اسم المدرس (App Name English)")
        self.entry_name.grid(row=1, column=0, pady=10, padx=40, sticky="ew")

        # 3. Web URL
        self.entry_url = ctk.CTkEntry(self, placeholder_text="رابط المنصة (Website URL)")
        self.entry_url.grid(row=2, column=0, pady=10, padx=40, sticky="ew")

        # 4. Pickers Frame
        self.frame_pickers = ctk.CTkFrame(self, fg_color="transparent")
        self.frame_pickers.grid(row=3, column=0, pady=10, padx=40, sticky="ew")
        
        self.btn_logo = ctk.CTkButton(self.frame_pickers, text="اختر اللوجو (Select Logo)", command=self.select_logo)
        self.btn_logo.pack(side="left", expand=True, padx=5)
        self.logo_path = None
        
        self.btn_output = ctk.CTkButton(self.frame_pickers, text="مكان الحفظ (Output Folder)", command=self.select_output, fg_color="green")
        self.btn_output.pack(side="right", expand=True, padx=5)
        self.output_path = os.path.join(self.logic.root_dir, "OUTPUTS") # Default

        # 5. Checkboxes
        self.frame_checks = ctk.CTkFrame(self, fg_color="transparent")
        self.frame_checks.grid(row=4, column=0, pady=10, padx=40)
        
        self.check_apk = ctk.CTkCheckBox(self.frame_checks, text="Android APK")
        self.check_apk.select()
        self.check_apk.pack(side="left", padx=10)
        
        self.check_aab = ctk.CTkCheckBox(self.frame_checks, text="Android Bundle (Store)")
        self.check_aab.pack(side="left", padx=10)
        
        self.check_win = ctk.CTkCheckBox(self.frame_checks, text="Windows EXE")
        self.check_win.pack(side="left", padx=10)

        # 6. Build Button
        self.btn_build = ctk.CTkButton(self, text="ابدأ البناء (Start Build) 🚀", command=self.start_build, height=50, font=("Roboto", 18))
        self.btn_build.grid(row=5, column=0, pady=20, padx=40, sticky="ew")

        # 7. Log Area
        self.textbox_log = ctk.CTkTextbox(self, height=200)
        self.textbox_log.grid(row=6, column=0, pady=(0, 20), padx=20, sticky="nsew")
        self.textbox_log.insert("0.0", "Logs will appear here...\n")

    def select_logo(self):
        file = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
        if file:
            self.logo_path = file
            self.btn_logo.configure(text=f"Logo Selected: {os.path.basename(file)}")

    def select_output(self):
        folder = filedialog.askdirectory()
        if folder:
            self.output_path = folder
            self.btn_output.configure(text=f"Save to: {os.path.basename(folder)}")

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
        t = threading.Thread(target=self.run_process, args=(name, url))
        t.start()

    def run_process(self, name, url):
        logic = self.logic
        
        # 1. Update Config (Mobile & Windows)
        self.log_message("⚙️ Updating Configuration...")
        logic.update_config_file(logic.mobile_path, name, url)
        logic.update_config_file(logic.windows_path, name, url)
        
        # 2. Update Logo
        if self.logo_path:
            self.log_message("🖼️ Updating Logo...")
            logic.replace_logo(logic.mobile_path, self.logo_path)
            # logic.replace_logo(logic.windows_path, self.logo_path) # Need to handle ico manually or reuse png for now
        
        # Ensure output dir exists
        os.makedirs(self.output_path, exist_ok=True)
        
        # 3. Android APK
        if self.check_apk.get():
            logic.build_android_apk(self.output_path, name, self.log_message)
            
        # 4. Android Bundle
        if self.check_aab.get():
            logic.build_android_bundle(self.output_path, name, self.log_message)
            
        # 5. Windows
        if self.check_win.get():
            logic.build_windows_exe(self.output_path, name, self.log_message)
            
        self.log_message("\n✨ ALL TASKS COMPLETED! ✨")
        self.btn_build.configure(state="normal", text="ابدأ البناء (Start Build) 🚀")

if __name__ == "__main__":
    app = BuilderApp()
    app.mainloop()
