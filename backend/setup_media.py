import os
from pathlib import Path

def setup_media_directories():
    # Get the base directory (where manage.py is located)
    base_dir = Path(__file__).resolve().parent
    
    # Create media directory
    media_dir = base_dir / 'media'
    media_dir.mkdir(exist_ok=True)
    
    # Create subdirectories for images and drawings
    note_images_dir = media_dir / 'note_images'
    note_drawings_dir = media_dir / 'note_drawings'
    
    note_images_dir.mkdir(exist_ok=True)
    note_drawings_dir.mkdir(exist_ok=True)
    
    # Set permissions (readable and writable by all)
    os.chmod(media_dir, 0o755)
    os.chmod(note_images_dir, 0o755)
    os.chmod(note_drawings_dir, 0o755)
    
    print("Media directories created successfully!")

if __name__ == '__main__':
    setup_media_directories() 