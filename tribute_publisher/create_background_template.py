"""
Permanently remove divider ornament from certificate template.
Creates certificate_background.png with divider removed.
"""
import os
from PIL import Image

def create_background_template():
    """Remove divider and create certificate_background.png"""
    module_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(module_dir, "templates", "certificate_template.png")
    output_path = os.path.join(module_dir, "templates", "certificate_background.png")
    
    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}")
        return False
    
    print(f"Loading template: {template_path}")
    # Load template
    img = Image.open(template_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    width, height = img.size
    print(f"Template size: {width} × {height} pixels")
    
    # Divider region to remove (approximately Y = 540 to 600 in original dimensions)
    divider_y_start = 540
    divider_y_end = 600
    divider_height = divider_y_end - divider_y_start
    
    print(f"Removing divider from Y={divider_y_start} to Y={divider_y_end} ({divider_height}px)")
    
    # Clone parchment texture from above the divider
    # Sample region above divider to use as replacement
    sample_y_start = 400
    sample_y_end = 540
    
    print(f"Sampling parchment texture from Y={sample_y_start} to Y={sample_y_end}")
    sample_region = img.crop((0, sample_y_start, width, sample_y_end))
    
    # Resize sample to match divider height
    sample_resized = sample_region.resize((width, divider_height), Image.LANCZOS)
    
    # Create result image
    result = img.copy()
    
    # Paste sample over divider region (full width)
    result.paste(sample_resized, (0, divider_y_start))
    
    # Save processed template
    print(f"Saving processed template to: {output_path}")
    result.save(output_path, "PNG")
    
    print(f"Successfully created certificate_background.png")
    print(f"  Original: {width}x{height}")
    print(f"  Processed: {width}x{height} (divider removed)")
    
    return True

if __name__ == "__main__":
    success = create_background_template()
    if success:
        print("\nTemplate processing complete!")
        print("  certificate_background.png is ready to use.")
    else:
        print("\nTemplate processing failed!")
