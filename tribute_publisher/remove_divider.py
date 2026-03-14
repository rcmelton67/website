"""
Script to remove the divider ornament from the certificate template.
Clones parchment texture to remove the divider cleanly.
"""
import os
from PIL import Image

def remove_divider_from_template():
    """Remove divider ornament and clone parchment texture."""
    module_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(module_dir, "templates", "certificate_template.png")
    output_path = os.path.join(module_dir, "templates", "certificate_background.png")
    
    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}")
        return
    
    # Load template
    img = Image.open(template_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    width, height = img.size
    
    # Divider is approximately at Y = 560 (in original 3750x2897 dimensions)
    # Scale factor is ~0.64, so divider is at ~358px in scaled version
    # But we're working with original template, so divider is at ~560px
    # Divider appears to be roughly 20-40px tall
    
    # Define divider region to remove (approximate bounds)
    divider_y_start = 540  # Start above divider
    divider_y_end = 600    # End below divider
    
    # Clone parchment texture from above the divider
    # Sample a region above the divider to use as replacement
    sample_y_start = 400
    sample_y_end = 540
    
    # Extract sample region
    sample_region = img.crop((0, sample_y_start, width, sample_y_end))
    
    # Calculate divider height
    divider_height = divider_y_end - divider_y_start
    
    # Resize sample to match divider height (stretch vertically if needed)
    sample_resized = sample_region.resize((width, divider_height), Image.LANCZOS)
    
    # Create new image
    result = img.copy()
    
    # Paste sample over divider region
    result.paste(sample_resized, (0, divider_y_start))
    
    # Save result
    result.save(output_path, "PNG")
    print(f"Removed divider ornament. Saved to: {output_path}")
    print(f"Original size: {width}×{height}")
    print(f"Divider removed from Y={divider_y_start} to Y={divider_y_end}")

if __name__ == "__main__":
    remove_divider_from_template()
