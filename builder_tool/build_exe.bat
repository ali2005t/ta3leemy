@echo off
echo Installing requirements...
pip install -r requirements.txt

echo Building EXE...
pyinstaller --noconfirm --onefile --windowed --name "Ta3leemyBuilder" --add-data "G:\python\Lib\site-packages\customtkinter;customtkinter" main.py


echo Done! You can find the EXE in the 'dist' folder.
pause
