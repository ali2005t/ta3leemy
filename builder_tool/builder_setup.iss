[Setup]
AppName=Ta3leemy Studio
AppVersion=2.0
DefaultDirName={autopf}\Ta3leemy Studio
DefaultGroupName=Ta3leemy Studio
OutputDir=..\builder_tool\installers
OutputBaseFilename=Ta3leemy_Studio_Setup_v2.0
Compression=lzma
SolidCompression=yes
PrivilegesRequired=lowest
SetupIconFile=..\builder_tool\icon.ico
DisableProgramGroupPage=yes

[Files]
Source: "..\builder_tool\dist\Ta3leemyBuilder.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\builder_tool\دليل_التشغيل_الجديد.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\builder_tool\icon.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\Ta3leemy Studio"; Filename: "{app}\Ta3leemyBuilder.exe"
Name: "{autodesktop}\Ta3leemy Studio"; Filename: "{app}\Ta3leemyBuilder.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"

[Run]
Filename: "{app}\Ta3leemyBuilder.exe"; Description: "Launch Ta3leemy Studio"; Flags: nowait postinstall skipifsilent
