; Script generated for Ta3leemy Studio
; Developed by Ali Mohamed

#define MyAppName "Ta3leemy Studio"
#define MyAppVersion "1.0"
#define MyAppPublisher "Ali Mohamed"
#define MyAppURL "https://ta3leemy.online"
#define MyAppExeName "Ta3leemy Studio.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{8B493198-4339-4467-8724-65653805904F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
; Remove the following line to run in administrative install mode (install for all users.)
PrivilegesRequired=lowest
OutputDir=installers
OutputBaseFilename=Ta3leemyStudio_Setup_v15
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion
; Include Templates
Source: "..\mobile_app_template\*"; DestDir: "{app}\mobile_app_template"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: ".git,.gradle,.idea,build,.dart_tool,windows\flutter\ephemeral"
Source: "..\windows_app_template\*"; DestDir: "{app}\windows_app_template"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: ".git,.gradle,.idea,build,.dart_tool,windows\flutter\ephemeral"
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent
