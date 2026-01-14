import customtkinter as ctk
import os
import threading
import sys
import time
import json
import re
from tkinter import filedialog
from builder_logic import BuilderLogic

# Configuration
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ProjectManager:
    def __init__(self, file_path):
        self.file_path = file_path
        self.projects = self.load_projects()

    def load_projects(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def save_project(self, name, data):
        self.projects[name] = data
        try:
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(self.projects, f, ensure_ascii=False, indent=4)
        except Exception as e:
            print(f"Error saving projects: {e}")

    def get_project_names(self):
        return list(self.projects.keys())

    def get_project(self, name):
        return self.projects.get(name)

class BuilderApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        self.title("Ta3leemy Studio 💎")
        self.geometry("900x800")
        self.configure(fg_color="#0f172a") # Slate 900
        
        # Set Window Icon
        if os.path.exists("icon.ico"):
            self.iconbitmap("icon.ico")
        
        # Initialize Logic
        if getattr(sys, 'frozen', False):
            application_path = os.path.dirname(sys.executable)
        else:
            application_path = os.path.dirname(os.path.abspath(__file__))
            
        possible_roots = [
            application_path,
            os.path.dirname(application_path),
            os.path.dirname(os.path.dirname(application_path))
        ]
        
        self.root_dir = application_path
        for path in possible_roots:
            if os.path.exists(os.path.join(path, "mobile_app_template")):
                self.root_dir = path
                break
        
        self.logic = BuilderLogic(self.root_dir)
        self.config_file = os.path.join(application_path, "studio_config.json")
        self.projects_file = os.path.join(application_path, "projects_history.json")
        self.project_manager = ProjectManager(self.projects_file)
        
        # Setup GUI Layout
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)
        
        self.create_sidebar()
        self.create_main_area()
        self.create_instructions_panel()
        
        # Load last settings (global preferences like output path)
        self.load_global_settings()
        
    def create_sidebar(self):
        self.sidebar = ctk.CTkFrame(self, width=200, corner_radius=0, fg_color="#1e293b")
        self.sidebar.grid(row=0, column=0, rowspan=2, sticky="nsew")
        self.sidebar.grid_rowconfigure(5, weight=1)
        
        self.logo_label = ctk.CTkLabel(self.sidebar, text="Ta3leemy\nStudio 💎", font=("Roboto", 24, "bold"), text_color="#38bdf8")
        self.logo_label.grid(row=0, column=0, padx=20, pady=(20, 10))
        
        self.lbl_dev = ctk.CTkLabel(self.sidebar, text="By Ali Mohamed", font=("Roboto", 10), text_color="#64748b")
        self.lbl_dev.grid(row=1, column=0, padx=20, pady=(0, 20))
        
        # Build Options
        self.lbl_options = ctk.CTkLabel(self.sidebar, text="خيارات البناء:", anchor="e", font=("Cairo", 14, "bold"))
        self.lbl_options.grid(row=2, column=0, padx=20, pady=(10, 0))
        
        self.check_apk = ctk.CTkCheckBox(self.sidebar, text="Android APK", fg_color="#4F46E5", font=("Cairo", 12))
        self.check_apk.grid(row=3, column=0, padx=20, pady=10, sticky="e")
        self.check_apk.select()
        
        self.check_aab = ctk.CTkCheckBox(self.sidebar, text="Android Bundle", fg_color="#4F46E5", font=("Cairo", 12))
        self.check_aab.grid(row=4, column=0, padx=20, pady=10, sticky="e")
        
        self.check_win = ctk.CTkCheckBox(self.sidebar, text="Windows EXE", fg_color="#0ea5e9", font=("Cairo", 12))
        self.check_win.grid(row=5, column=0, padx=20, pady=10, sticky="e")
        
        # Utilities
        self.btn_clean = ctk.CTkButton(self.sidebar, text="🧹 تنظيف الكاش", command=self.start_clean, height=35, fg_color="#ef4444", hover_color="#dc2626", font=("Cairo", 12, "bold"))
        self.btn_clean.grid(row=6, column=0, padx=20, pady=(20, 10), sticky="ew")

        # Build Button (Sidebar)
        self.btn_build = ctk.CTkButton(self.sidebar, text="🚀 ابدأ البناء", command=self.start_build, height=50, fg_color="#22c55e", hover_color="#16a34a", font=("Cairo", 18, "bold"))
        self.btn_build.grid(row=7, column=0, padx=20, pady=10, sticky="ew")

    def create_main_area(self):
        self.main_frame = ctk.CTkFrame(self, corner_radius=0, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=20, pady=20)
        
        # Section 0: Project Selection
        self.frame_project = ctk.CTkFrame(self.main_frame, fg_color="#334155")
        self.frame_project.pack(fill="x", pady=(0, 20))
        
        self.lbl_project = ctk.CTkLabel(self.frame_project, text="📂 اختر مشروع سابق لتحديثه:", font=("Cairo", 14, "bold"), text_color="#cbd5e1")
        self.lbl_project.pack(side="right", padx=15, pady=15)
        
        self.combo_projects = ctk.CTkComboBox(self.frame_project, values=["مشروع جديد"] + self.project_manager.get_project_names(), command=self.on_project_select, font=("Cairo", 12))
        self.combo_projects.pack(side="right", padx=15, pady=15, fill="x", expand=True)
        self.combo_projects.set("مشروع جديد")

        # Section 1: App Config
        self.lbl_config = ctk.CTkLabel(self.main_frame, text="1. إعدادات التطبيق", font=("Cairo", 18, "bold"), text_color="#e2e8f0")
        self.lbl_config.pack(anchor="e", pady=(0, 10))
        
        self.frame_config = ctk.CTkFrame(self.main_frame, fg_color="#334155")
        self.frame_config.pack(fill="x", pady=(0, 20))
        
        self.entry_name = ctk.CTkEntry(self.frame_config, placeholder_text="اسم التطبيق (إنجليزي) - App Name", height=40, font=("Roboto", 14))
        self.entry_name.pack(fill="x", padx=15, pady=15)
        
        self.entry_url = ctk.CTkEntry(self.frame_config, placeholder_text="رابط المنصة - Website URL", height=40, font=("Roboto", 14))
        self.entry_url.pack(fill="x", padx=15, pady=(0, 15))

        self.entry_version = ctk.CTkEntry(self.frame_config, placeholder_text="رقم الإصدار (1.0.0) - Version", height=40, font=("Roboto", 14))
        self.entry_version.pack(fill="x", padx=15, pady=15)

        # Section 2: Assets
        self.lbl_assets = ctk.CTkLabel(self.main_frame, text="2. الملفات والمخرجات", font=("Cairo", 18, "bold"), text_color="#e2e8f0")
        self.lbl_assets.pack(anchor="e", pady=(0, 10))
        
        self.frame_assets = ctk.CTkFrame(self.main_frame, fg_color="#334155")
        self.frame_assets.pack(fill="x", pady=(0, 20))
        
        self.btn_logo = ctk.CTkButton(self.frame_assets, text="🖼️ اختر اللوجو (PNG/JPG)", command=self.select_logo, height=40, fg_color="#475569", hover_color="#334155", font=("Cairo", 14))
        self.btn_logo.pack(side="left", padx=15, pady=15, expand=True, fill="x")
        self.logo_path = None
        
        self.btn_output = ctk.CTkButton(self.frame_assets, text="📂 مكان الحفظ العام", command=self.select_output, height=40, fg_color="#475569", hover_color="#334155", font=("Cairo", 14))
        self.btn_output.pack(side="right", padx=15, pady=15, expand=True, fill="x")
        self.output_path = os.path.join(self.logic.root_dir, "OUTPUTS")
        
        # Section 3: Logs
        self.lbl_logs = ctk.CTkLabel(self.main_frame, text="سجل العمليات", font=("Cairo", 18, "bold"), text_color="#e2e8f0")
        self.lbl_logs.pack(anchor="e", pady=(0, 10))
        
        self.textbox_log = ctk.CTkTextbox(self.main_frame, height=150, font=("Consolas", 12), fg_color="#020617")
        self.textbox_log.pack(fill="both", expand=True)
        
        self.progress_bar = ctk.CTkProgressBar(self.main_frame, height=12, progress_color="#4F46E5")
        self.progress_bar.pack(fill="x", pady=(10, 5))
        self.progress_bar.set(0)
        
        self.lbl_percentage = ctk.CTkLabel(self.main_frame, text="0%", font=("Roboto", 12, "bold"), text_color="#94a3b8")
        self.lbl_percentage.pack(anchor="e")

    def create_instructions_panel(self):
        self.frame_inst = ctk.CTkFrame(self, height=120, corner_radius=10, fg_color="#1e293b")
        self.frame_inst.grid(row=1, column=1, sticky="ew", padx=20, pady=(0, 20))
        
        self.lbl_inst_title = ctk.CTkLabel(self.frame_inst, text="📝 تعليمات الاستخدام", font=("Cairo", 15, "bold"), text_color="#38bdf8")
        self.lbl_inst_title.pack(pady=(10, 2))
        
        inst_text = """• المجلدات: يتم إنشاء مجلد جديد لكل عملية بناء (نسخة منفصلة).
• الأداء: الزرار 'تنظيف الكاش' يستخدم فقط عند ظهور مشاكل (قد يبطئ البناء التالي).
• الحفظ: يتم حفظ آخر الإعدادات وتفاصيل المشروع تلقائياً."""
        
        self.lbl_inst_text = ctk.CTkLabel(self.frame_inst, text=inst_text, font=("Cairo", 12), text_color="#94a3b8", justify="right")
        self.lbl_inst_text.pack()

    def on_project_select(self, choice):
        if choice == "مشروع جديد":
            self.entry_name.delete(0, "end")
            self.entry_url.delete(0, "end")
            self.entry_version.delete(0, "end")
            self.entry_version.insert(0, "1.0.0")
            self.logo_path = None
            self.btn_logo.configure(text="🖼️ اختر اللوجو (PNG/JPG)", fg_color="#475569")
        else:
            data = self.project_manager.get_project(choice)
            if data:
                self.entry_name.delete(0, "end")
                self.entry_name.insert(0, data.get('name', ''))
                self.entry_url.delete(0, "end")
                self.entry_url.insert(0, data.get('url', ''))
                
                # Auto increment version logic (simple)
                last_ver = data.get('version', '1.0.0')
                self.entry_version.delete(0, "end")
                self.entry_version.insert(0, last_ver) 
                
                saved_logo = data.get('logo_path')
                if saved_logo and os.path.exists(saved_logo):
                    self.logo_path = saved_logo
                    self.btn_logo.configure(text=f"✅ {os.path.basename(saved_logo)}", fg_color="#059669")

    def load_global_settings(self):
        import json
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    saved_output = data.get('output_path')
                    if saved_output and os.path.exists(saved_output):
                        self.output_path = saved_output
                        self.btn_output.configure(text=f"📂 {os.path.basename(saved_output)}", fg_color="#059669")
            except Exception as e:
                self.log_message(f"Could not load global settings: {e}")

    def save_global_settings(self):
        data = {
            'output_path': self.output_path
        }
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(data, f)
        except:
            pass

    def select_logo(self):
        file = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
        if file:
            self.logo_path = file
            self.btn_logo.configure(text=f"✅ {os.path.basename(file)}", fg_color="#059669")

    def select_output(self):
        folder = filedialog.askdirectory()
        if folder:
            self.output_path = folder
            self.btn_output.configure(text=f"📂 {os.path.basename(folder)}", fg_color="#059669")

    def log_message(self, msg):
        self.textbox_log.insert("end", msg + "\n")
        self.textbox_log.see("end")

    def start_clean(self):
        if self.btn_clean.cget("state") == "disabled":
             return
             
        self.btn_clean.configure(state="disabled", text="جاري التنظيف... 🧹")
        self.log_message("\n📢 بدء عملية تنظيف الكاش (قد تستغرق وقتاً)...")
        
        def run_clean():
            self.logic.deep_clean_project(self.log_message)
            self.btn_clean.configure(state="normal", text="🧹 تنظيف الكاش")
            
        t = threading.Thread(target=run_clean)
        t.start()

    def update_progress(self, val):
        self.progress_bar.set(val)
        self.lbl_percentage.configure(text=f"{int(val * 100)}%")

    def start_build(self):
        name = self.entry_name.get().strip()
        url = self.entry_url.get().strip()
        version = self.entry_version.get().strip()
        
        if not name or not url:
            self.log_message("❌ خطأ: يجب إدخال الاسم والرابط!")
            return
            
        # Save Project Data
        project_data = {
            'name': name,
            'url': url,
            'version': version,
            'logo_path': self.logo_path,
            'last_build': time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.project_manager.save_project(name, project_data)
        self.combo_projects.configure(values=["مشروع جديد"] + self.project_manager.get_project_names())
        self.save_global_settings()
        
        self.btn_build.configure(state="disabled", text="جاري البناء... ⏳")
        self.update_progress(0)
        
        t = threading.Thread(target=self.run_process, args=(name, url, version))
        t.start()

    def run_process(self, name, url, version):
        try:
            total_steps = 6
            current_step = 0
            
            self.log_message(f"🚀 Starting Build for '{name}' (v{version})...")
            
            # Create Organized Output Folder: OUTPUTS / MySchool_v1.0.0
            safe_ver = version.replace(".", "_")
            safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', name)
            final_output_dir = os.path.join(self.output_path, f"{safe_name}_v{safe_ver}")
            os.makedirs(final_output_dir, exist_ok=True)
            self.log_message(f"📂 Output Folder: {final_output_dir}")
            
            # 1. Config
            self.logic.update_config_file(self.logic.mobile_path, name, url)
            self.logic.update_config_file(self.logic.windows_path, name, url)
            
            # 1.5 Deep Renaming
            self.logic.update_android_basics(self.logic.mobile_path, name, name)
            self.logic.update_windows_basics(self.logic.windows_path, name)
            
            current_step += 1; self.update_progress(current_step/total_steps)

            # 2. Versioning
            self.logic.update_version(self.logic.mobile_path, version)
            self.logic.update_version(self.logic.windows_path, version)
            current_step += 1; self.update_progress(current_step/total_steps)
            
            # 3. Logo
            if self.logo_path:
                self.logic.replace_logo(self.logic.mobile_path, self.logo_path)
            current_step += 1; self.update_progress(current_step/total_steps)
            
            # 4. APK
            if self.check_apk.get():
                self.log_message("🤖 Building APK...")
                self.logic.build_android_apk(final_output_dir, name, self.log_message)
            current_step += 1; self.update_progress(current_step/total_steps)
                
            # 5. AAB
            if self.check_aab.get():
                self.log_message("📦 Building Bundle...")
                self.logic.build_android_bundle(final_output_dir, name, self.log_message)
            current_step += 1; self.update_progress(current_step/total_steps)
            
            # 6. Windows
            if self.check_win.get():
                self.log_message("💻 Building Windows EXE...")
                self.logic.build_windows_exe(final_output_dir, name, self.log_message)
            
            self.update_progress(1.0)
            self.log_message(f"\n✨ تمت العملية بنجاح! الملفات في: {final_output_dir} ✨")
            
            # Open folder
            os.startfile(final_output_dir)
            
        except Exception as e:
            self.log_message(f"❌ Error: {e}")
        finally:
             self.btn_build.configure(state="normal", text="🚀 ابدأ البناء")

if __name__ == "__main__":
    app = BuilderApp()
    app.mainloop()
