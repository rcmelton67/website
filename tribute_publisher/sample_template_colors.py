"""
Sample text colors from the certificate template to match embedded text.
"""
from PIL import Image
import os

def sample_template_colors():
    """Sample colors from text areas in the template."""
    module_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(module_dir, "templates", "certificate_template.png")
    
    if not os.path.exists(template_path):
        print(f"Template not found: {template_path}")
        return
    
    img = Image.open(template_path)
    if img.mode != "RGB":
        img = img.convert("RGB")
    
    width, height = img.size
    pixels = img.load()
    
    # Sample areas where embedded text appears
    # Title area (around Y=200-300)
    title_colors = []
    for y in range(200, 300, 5):
        for x in range(width // 4, 3 * width // 4, 10):
            r, g, b = pixels[x, y]
            # Only sample darker pixels (likely text)
            if r < 150 and g < 150 and b < 150:
                title_colors.append((r, g, b))
    
    # Quote area (around Y=2400-2600)
    quote_colors = []
    for y in range(2400, 2600, 5):
        for x in range(width // 8, width // 2, 10):
            r, g, b = pixels[x, y]
            if r < 150 and g < 150 and b < 150:
                quote_colors.append((r, g, b))
    
    # Calculate average colors
    def avg_color(color_list):
        if not color_list:
            return None
        avg_r = sum(c[0] for c in color_list) // len(color_list)
        avg_g = sum(c[1] for c in color_list) // len(color_list)
        avg_b = sum(c[2] for c in color_list) // len(color_list)
        return (avg_r, avg_g, avg_b)
    
    title_avg = avg_color(title_colors)
    quote_avg = avg_color(quote_colors)
    
    print(f"Template size: {width}x{height}")
    print(f"\nTitle area colors sampled: {len(title_colors)} pixels")
    if title_avg:
        print(f"Average title color: RGB{title_avg} = #{title_avg[0]:02x}{title_avg[1]:02x}{title_avg[2]:02x}")
    
    print(f"\nQuote area colors sampled: {len(quote_colors)} pixels")
    if quote_avg:
        print(f"Average quote color: RGB{quote_avg} = #{quote_avg[0]:02x}{quote_avg[1]:02x}{quote_avg[2]:02x}")
    
    # Recommend colors
    if title_avg:
        print(f"\nRecommended colors:")
        print(f"  Pet Name: RGB{title_avg}")
        print(f"  Message: RGB{title_avg} (or slightly lighter)")
        print(f"  Dates: RGB{title_avg} (or slightly lighter)")

if __name__ == "__main__":
    sample_template_colors()
