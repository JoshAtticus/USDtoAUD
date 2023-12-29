import os
import zipfile
import glob

def print_bold_yellow(text):
    print("\033[1;33m" + text + "\033[0m")

def print_blue(text):
    print("\033[34m" + text + "\033[0m")

def print_bold_green(text):
    print("\033[1;32m" + text + "\033[0m")

def get_latest_build_number():
   """Finds the latest build number from existing ZIP files in the 'builds' folder."""
   builds_folder = "builds"
   zip_files = glob.glob(os.path.join(builds_folder, "*.zip"))

   if not zip_files:
       return 0  # No existing builds, start with 0

   latest_zip = max(zip_files, key=os.path.getctime)
   build_number = int(os.path.basename(latest_zip).replace("build-", "").replace(".zip", ""))
   return build_number

def create_new_build():
    build_number = get_latest_build_number() + 1
    new_zip_name = f"build-{build_number}.zip"
    builds_folder = "builds"

    print_bold_yellow("Building Extension...")

    with zipfile.ZipFile(new_zip_name, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d != "builds"]
            for file in files:
                if file not in (".env", "README.md", ".DS_Store", ".gitignore", "build.py", new_zip_name):
                    file_path = os.path.join(root, file)
                    print_blue(f"Built {file_path}!")
                    zip_file.write(file_path, arcname=os.path.relpath(file_path, os.curdir))

    os.rename(new_zip_name, os.path.join(builds_folder, new_zip_name))

    build_path = os.path.join(builds_folder, new_zip_name)
    print_bold_green(f"Build Complete! Build available at {build_path}")

if __name__ == "__main__":
    create_new_build()
