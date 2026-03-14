"""
Certificate Generator for Pet Memorial Tributes

Generates personalized PDF certificates using a PNG template as the base background.
Overlays pet photo, name, life dates, and tribute message.
"""

import os
import re
import time
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Template caching for performance
_cached_template = None
_cached_template_path = None
_cached_template_mtime = None


def compose_rounded_photo(
    photo_path: str,
    output_size: int = 160,
    corner_radius: int = 18
) -> Image.Image:
    """
    STAGE 1: Photo Composition
    
    Creates a clean rounded-rectangle photo with transparent background.
    No white square should be visible - only the rounded photo itself.
    
    Process:
    1. Load photo
    2. Center crop to square
    3. Resize to final size
    4. Create transparent RGBA canvas
    5. Paste photo onto transparent canvas
    6. Apply rounded-rectangle alpha mask to entire image block
    7. Return final transparent rounded image
    
    Args:
        photo_path: Path to source photo
        output_size: Target size for square image (default 160px)
        corner_radius: Radius for rounded corners (default 18px)
    
    Returns:
        PIL Image with RGBA mode (transparent background, rounded corners)
    """
    if not os.path.exists(photo_path):
        raise FileNotFoundError(f"Photo not found: {photo_path}")
    
    # Load and convert to RGB
    with Image.open(photo_path) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        
        width, height = img.size
        
        # Step 1: Center crop to square
        if width > height:
            left = (width - height) // 2
            img = img.crop((left, 0, left + height, height))
        elif height > width:
            top = (height - width) // 2
            img = img.crop((0, top, width, top + width))
        
        # Step 2: Resize to final size
        img = img.resize((output_size, output_size), Image.LANCZOS)
        
        # Step 3: Create transparent RGBA canvas
        final = Image.new("RGBA", (output_size, output_size), (0, 0, 0, 0))
        
        # Step 4: Create rounded-rectangle alpha mask
        mask = Image.new("L", (output_size, output_size), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle(
            [(0, 0), (output_size, output_size)],
            corner_radius,
            fill=255
        )
        
        # Step 5: Paste photo onto transparent canvas and apply mask
        final.paste(img, (0, 0))
        final.putalpha(mask)
        
        return final


def extract_message_from_tribute(text: str) -> str:
    """
    Extract message from tribute text, ignoring header lines and blank lines.
    
    Args:
        text: Full tribute message text
    
    Returns:
        Extracted message or None if no valid message found
    """
    if not text:
        return None
    
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    
    # Split into lines
    lines = text.splitlines()
    clean_lines = []
    
    for line in lines:
        line = line.strip()
        
        # Skip blank lines
        if not line:
            continue
        
        # Skip markdown headers
        if line.startswith("#"):
            continue
        
        # Skip header lines containing name/breed/date markers
        if "—" in line or "(" in line:
            continue
        
        clean_lines.append(line)
    
    if not clean_lines:
        return None
    
    # Take first clean line
    sentence = clean_lines[0]
    
    # Limit to 140 characters
    if len(sentence) > 140:
        sentence = sentence[:137] + "..."
    
    return sentence


def get_certificate_message(tribute: dict, tribute_message: str) -> str:
    """
    Get certificate message using priority:
    1. Manual override (certificate_text field)
    2. Extract from tribute message
    3. Fallback to default message
    
    Args:
        tribute: Tribute data dictionary (may contain certificate_text)
        tribute_message: Full tribute message text
    
    Returns:
        Certificate message text
    """
    # 1. Use manual override if provided
    certificate_text = tribute.get("certificate_text", "").strip() if isinstance(tribute, dict) else ""
    if certificate_text:
        return certificate_text
    
    # 2. Otherwise extract from tribute body
    message = extract_message_from_tribute(tribute_message)
    if message:
        return message
    
    # 3. Final fallback
    return "Forever loved. Forever remembered."


def filter_certificate_message(tribute_text: str) -> str:
    """
    Filter tribute text for certificate display.
    
    Processing steps:
    1. Split tribute text into lines
    2. Remove first line if it contains "—", "(", ")", or resembles header
    3. Remove blank lines
    4. Take first sentence of remaining text
    5. Limit to 120 characters
    6. Truncate with "..." if longer
    
    Args:
        tribute_text: Full tribute message text
    
    Returns:
        Clean short memorial sentence for certificate
    """
    if not tribute_text:
        return ""
    
    # Step 1: Convert HTML line breaks to newlines, then remove other HTML tags
    text = re.sub(r"<br\s*/?>", "\n", tribute_text, flags=re.IGNORECASE)
    text = re.sub(r"</p>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    # Normalize whitespace but preserve newlines
    text = re.sub(r"[ \t]+", " ", text)  # Collapse spaces/tabs but keep newlines
    text = text.strip()
    
    # Step 2: Split into lines
    lines = [line.strip() for line in text.split('\n')]
    
    # Step 3: Remove first line if it looks like a header
    if lines:
        first_line = lines[0].strip()
        # Check if first line contains header markers
        if any(marker in first_line for marker in ["—", "(", ")"]):
            lines = lines[1:]
        # Check if first line looks like a header (short, no sentence punctuation)
        elif len(first_line) < 50 and not re.search(r'[.!?]', first_line):
            # Might be a header - check for common patterns (dates, short phrases)
            if re.search(r'\b\d{4}\b', first_line) or len(first_line.split()) < 5:
                lines = lines[1:]
    
    # Step 4: Remove blank lines
    lines = [line for line in lines if line.strip()]
    
    if not lines:
        return ""
    
    # Step 5: Join remaining lines and take first sentence
    remaining_text = " ".join(lines)
    
    # Try to find first sentence
    sentence_match = re.search(r"(.+?[.!?])(?:\s|$)", remaining_text)
    if sentence_match:
        message = sentence_match.group(1).strip()
    else:
        message = remaining_text
    
    # Step 6: Limit to 120 characters, truncate with "..." if longer
    if len(message) > 120:
        message = message[:120].rstrip() + "..."
    
    return message


def extract_first_sentence(text: str, max_chars: int = 180) -> str:
    """
    Extract first sentence from tribute message, or truncate if no sentence break.
    
    Args:
        text: Full tribute message text
        max_chars: Maximum characters if no sentence break found
    
    Returns:
        First sentence or truncated text
    """
    if not text:
        return ""
    
    # Remove HTML tags if present
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    
    # Try to find first sentence
    sentence_match = re.search(r"(.+?[.!?])(?:\s|$)", text)
    if sentence_match:
        return sentence_match.group(1).strip()
    
    # No sentence break: truncate at max_chars
    if len(text) > max_chars:
        return text[:max_chars].rstrip() + "..."
    
    return text


def wrap_text_to_lines_pil(draw, text: str, font, max_width: float, max_lines: int = 3) -> list:
    """
    Wrap text to fit within max_width using PIL, limiting to max_lines.
    If text is too long, truncate last line with ellipsis.
    
    Args:
        draw: PIL ImageDraw object
        text: Text to wrap
        font: PIL ImageFont object
        max_width: Maximum width in pixels
        max_lines: Maximum number of lines
    
    Returns:
        List of text lines
    """
    words = text.split()
    lines = []
    current_line = ""
    
    for word in words:
        test_line = f"{current_line} {word}".strip() if current_line else word
        # Measure text width using PIL's textbbox
        bbox = draw.textbbox((0, 0), test_line, font=font)
        text_width = bbox[2] - bbox[0]
        
        if text_width <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
                if len(lines) >= max_lines:
                    break
            current_line = word
    
    if current_line and len(lines) < max_lines:
        lines.append(current_line)
    elif current_line and len(lines) >= max_lines:
        # Truncate last line with ellipsis
        last_line = lines[-1] if lines else ""
        if last_line:
            test_ellipsis = f"{last_line}..."
            bbox = draw.textbbox((0, 0), test_ellipsis, font=font)
            if (bbox[2] - bbox[0]) <= max_width:
                lines[-1] = test_ellipsis
            else:
                # Remove last word and add ellipsis
                words = last_line.split()
                if len(words) > 1:
                    truncated = " ".join(words[:-1]) + "..."
                    bbox = draw.textbbox((0, 0), truncated, font=font)
                    if (bbox[2] - bbox[0]) <= max_width:
                        lines[-1] = truncated
    
    return lines[:max_lines]


def wrap_text_to_lines(canvas, text: str, font_name: str, font_size: int, max_width: float, max_lines: int = 3) -> list:
    """
    Wrap text to fit within max_width, limiting to max_lines.
    If text is too long, truncate last line with ellipsis.
    
    Args:
        canvas: ReportLab canvas (for stringWidth measurement)
        text: Text to wrap
        font_name: Font name (e.g., "Helvetica")
        font_size: Font size in points
        max_width: Maximum width in points
        max_lines: Maximum number of lines
    
    Returns:
        List of text lines
    """
    words = text.split()
    lines = []
    current_line = ""
    
    for word in words:
        test_line = f"{current_line} {word}".strip() if current_line else word
        if canvas.stringWidth(test_line, font_name, font_size) <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
                if len(lines) >= max_lines:
                    # Truncate with ellipsis if we hit max lines
                    break
            current_line = word
    
    # Add remaining line if we haven't hit max
    if current_line and len(lines) < max_lines:
        lines.append(current_line)
    elif current_line and len(lines) >= max_lines:
        # Truncate last word with ellipsis
        last_line = lines[-1] if lines else ""
        if last_line:
            # Try to add part of current_line with ellipsis
            test_ellipsis = f"{last_line}..."
            if canvas.stringWidth(test_ellipsis, font_name, font_size) <= max_width:
                lines[-1] = test_ellipsis
            else:
                # Remove last word and add ellipsis
                words = last_line.split()
                if len(words) > 1:
                    truncated = " ".join(words[:-1]) + "..."
                    if canvas.stringWidth(truncated, font_name, font_size) <= max_width:
                        lines[-1] = truncated
    
    return lines[:max_lines]


def generate_certificate(
    pet_name: str,
    life_dates: str,
    tribute_message: str,
    pet_photo_path: str,
    output_folder: str,
    template_path: str = None,
    tribute: dict = None
) -> str:
    """
    Generate a personalized certificate PDF.
    
    Args:
        pet_name: Pet's name
        life_dates: Life dates (e.g., "2009 – 2024")
        tribute_message: Full tribute message (first sentence will be used)
        pet_photo_path: Path to pet photo (optional, can be None)
        output_folder: Folder where certificate.pdf will be saved
        template_path: Path to certificate template PNG (defaults to templates/certificate_template.png)
    
    Returns:
        Path to generated certificate.pdf file
    """
    start_time = time.time()
    perf_log = []
    
    # ==========================================
    # Certificate Canvas Constants (SCALED FOR 8×10 FRAME)
    # All elements anchored relative to divider ornament
    # 8×10 frame at 300 DPI = 2400 × 3000 pixels
    # Current template: 3750 × 2897 pixels
    # Scale factor: 0.64 (width) to fit 8" width, then scale height proportionally
    # ==========================================
    # Target dimensions for 8×10 frame at 300 DPI
    TARGET_WIDTH_8X10 = 2400  # 8 inches × 300 DPI
    TARGET_HEIGHT_8X10 = 3000  # 10 inches × 300 DPI
    
    # Original template dimensions
    ORIGINAL_WIDTH = 3750
    ORIGINAL_HEIGHT = 2897
    
    # Calculate scale factor to fit width (most restrictive)
    SCALE_FACTOR = TARGET_WIDTH_8X10 / ORIGINAL_WIDTH  # 2400 / 3750 = 0.64
    
    # Recalculate to ensure it fits within 8×10 bounds
    # Use the smaller scale factor to ensure everything fits
    width_scale = TARGET_WIDTH_8X10 / ORIGINAL_WIDTH
    height_scale = TARGET_HEIGHT_8X10 / ORIGINAL_HEIGHT
    SCALE_FACTOR = min(width_scale, height_scale)  # Use most restrictive (ensures everything fits)
    
    CANVAS_WIDTH = int(ORIGINAL_WIDTH * SCALE_FACTOR)
    CANVAS_HEIGHT = int(ORIGINAL_HEIGHT * SCALE_FACTOR)
    CENTER_X = CANVAS_WIDTH / 2  # Canvas center
    
    # Safe print zone margin (scaled proportionally)
    SAFE_MARGIN = int(300 * SCALE_FACTOR)  # Scaled from 300px
    
    # Debug mode - set to False for production (no guide overlays)
    debug_certificate_layout = False
    
    # ==========================================
    # Divider Ornament Anchor Point (SCALED)
    # Everything flows downward from the divider
    # ==========================================
    DIVIDER_Y = int(560 * SCALE_FACTOR)  # Scaled divider ornament Y position
    
    # ==========================================
    # Photo Placement (anchored below divider, SCALED)
    # Photo sits centered under divider ornament
    # ==========================================
    PHOTO_SIZE = int(780 * SCALE_FACTOR)  # Scaled square image
    PHOTO_X = CENTER_X - (PHOTO_SIZE / 2)  # Centered horizontally
    PHOTO_Y = int((560 + 120 - 100 + 25 + 20 - 80 + 140) * SCALE_FACTOR)  # Scaled position (moved down 140px)
    PHOTO_CORNER_RADIUS = int(70 * SCALE_FACTOR)  # Scaled rounded corners
    
    # ==========================================
    # Pet Name Placement (anchored below photo, SCALED)
    # ==========================================
    NAME_CENTER_X = CENTER_X
    NAME_Y = int((1460 + 140 - 100) * SCALE_FACTOR)  # Scaled position (moved up 100px from previous)
    FONT_NAME_SIZE = int(180 * SCALE_FACTOR)  # Scaled font size
    
    # ==========================================
    # Tribute Message Placement (anchored below name, SCALED)
    # ==========================================
    MAX_CERT_MESSAGE = 300  # Character limit (not scaled)
    TEXT_WIDTH = int(2600 * SCALE_FACTOR)  # Scaled wrap width
    MESSAGE_CENTER_X = CENTER_X
    MESSAGE_Y = int((1700 + 140 - 100) * SCALE_FACTOR)  # Scaled position (moved up 100px from previous)
    FONT_MESSAGE_SIZE = int(72 * SCALE_FACTOR)  # Scaled font size
    LINE_HEIGHT = int(90 * SCALE_FACTOR)  # Scaled line height
    MAX_LINES = 4  # Maximum lines (not scaled)
    
    # ==========================================
    # Dates Placement (anchored below message, SCALED)
    # ==========================================
    DATES_CENTER_X = CENTER_X
    DATES_Y = int((2140 + 140 - 140 - 40) * SCALE_FACTOR)  # Scaled position (moved up 40px more)
    FONT_DATES_SIZE = int(95 * SCALE_FACTOR)  # Scaled font size
    
    # Get template path (use certificate_template.png with decorative divider)
    if template_path is None:
        module_dir = os.path.dirname(os.path.abspath(__file__))
        # Use certificate_template.png (original template with decorative divider)
        template_path = os.path.join(module_dir, "templates", "certificate_template.png")
        # Fallback to certificate_background.png if template doesn't exist
        if not os.path.exists(template_path):
            template_path = os.path.join(module_dir, "templates", "certificate_background.png")
    
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Certificate template not found: {template_path}")
    
    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, "certificate.pdf")
    
    # Load PNG template background (with caching for performance)
    t0 = time.time()
    global _cached_template, _cached_template_path, _cached_template_mtime
    
    # Check if we can use cached template
    use_cache = False
    if _cached_template is not None and _cached_template_path == template_path:
        try:
            current_mtime = os.path.getmtime(template_path)
            if current_mtime == _cached_template_mtime:
                use_cache = True
        except OSError:
            pass  # File might not exist, will reload
    
    if use_cache:
        template_image = _cached_template.copy()
        perf_log.append(f"Template (cached): {time.time() - t0:.2f}s")
    else:
        # Load template and cache it
        # Note: certificate_background.png should already have divider removed
        template_image = Image.open(template_path)
        if template_image.mode != "RGB":
            template_image = template_image.convert("RGB")
        
        # Cache the template
        _cached_template = template_image.copy()
        _cached_template_path = template_path
        try:
            _cached_template_mtime = os.path.getmtime(template_path)
        except OSError:
            _cached_template_mtime = None
        perf_log.append(f"Template (loaded): {time.time() - t0:.2f}s")
    
    # Get page dimensions from template image
    page_width, page_height = template_image.size
    
    # Scale template to fit 8×10 frame dimensions
    # Resize template to target dimensions while maintaining aspect ratio
    if page_width != CANVAS_WIDTH or page_height != CANVAS_HEIGHT:
        # Resize template to scaled dimensions
        template_image = template_image.resize((CANVAS_WIDTH, CANVAS_HEIGHT), Image.LANCZOS)
        perf_log.append(f"Template scaled: {page_width}×{page_height} → {CANVAS_WIDTH}×{CANVAS_HEIGHT}")
    
    # Create a copy of the template to draw on
    certificate_image = template_image.copy()
    draw = ImageDraw.Draw(certificate_image)
    
    # ==========================================
    # Debug Mode: Draw Layout Guides (DISABLED IN PRODUCTION)
    # ==========================================
    # All debug overlays removed for production mode
    
    # Try to load fonts, fall back to default if not available
    def load_font(size, bold=False):
        """Try to load a font, fall back to default if not found."""
        font_paths = []
        if os.name == 'nt':  # Windows
            if bold:
                font_paths = [
                    "C:/Windows/Fonts/arialbd.ttf",
                    "C:/Windows/Fonts/ARIALBD.TTF",
                ]
            else:
                font_paths = [
                    "C:/Windows/Fonts/arial.ttf",
                    "C:/Windows/Fonts/ARIAL.TTF",
                ]
        else:  # macOS/Linux
            font_paths = [
                "/System/Library/Fonts/Helvetica.ttc",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            ]
        
        for path in font_paths:
            try:
                if path.endswith('.ttc'):
                    # For .ttc files, need to specify font index (0 for regular)
                    return ImageFont.truetype(path, size, index=0)
                else:
                    return ImageFont.truetype(path, size)
            except:
                continue
        
        # Fall back to default font
        try:
            return ImageFont.load_default()
        except:
            return None
    
    name_font = load_font(FONT_NAME_SIZE, bold=True)
    dates_font = load_font(FONT_DATES_SIZE, bold=False)
    message_font = load_font(FONT_MESSAGE_SIZE, bold=False)
    
    # ==========================================
    # Process message text (using new selection logic)
    # ==========================================
    # Get certificate message using priority: manual override → extraction → fallback
    tribute_dict = tribute if tribute else {}
    message_text = get_certificate_message(tribute_dict, tribute_message)
    
    # Remove slug patterns and normalize
    message_text = re.sub(r'\b\w*_\w*\b', '', message_text)
    message_text = re.sub(r'\s+', ' ', message_text).strip()
    
    # Enforce character limit - remove last complete sentence if over limit
    if len(message_text) > MAX_CERT_MESSAGE:
        # Save original text for fallback
        original_text = message_text
        
        # Split by sentence endings (. ! ?) - keep punctuation with sentences
        sentence_pattern = r'([^.!?]+[.!?])\s*'
        sentences = re.findall(sentence_pattern, message_text)
        
        # If no sentences found with pattern, try simpler split
        if not sentences:
            # Fallback: split on sentence endings
            parts = re.split(r'([.!?])', message_text)
            sentences = []
            for i in range(0, len(parts) - 1, 2):
                if i + 1 < len(parts):
                    sentence = (parts[i] + parts[i + 1]).strip()
                    if sentence:
                        sentences.append(sentence)
        
        # Remove last sentence if total exceeds limit
        if sentences:
            result_text = ""
            
            # Try removing sentences from the end until we're under the limit
            while sentences:
                test_text = " ".join(sentences).strip()
                if len(test_text) <= MAX_CERT_MESSAGE:
                    result_text = test_text
                    break
                # Remove last sentence
                sentences.pop()
            
            # Use the result if we found a valid combination
            if result_text:
                message_text = result_text
            elif sentences:
                # If we still have sentences but they're all too long, use first sentence truncated
                first_sentence = sentences[0].strip()
                if len(first_sentence) > MAX_CERT_MESSAGE:
                    message_text = first_sentence[:MAX_CERT_MESSAGE - 3].rstrip() + "..."
                else:
                    message_text = first_sentence
            else:
                # All sentences were removed, use original text truncated as fallback
                message_text = original_text[:MAX_CERT_MESSAGE - 3].rstrip() + "..."
        else:
            # No sentences found, use simple truncation as fallback
            message_text = original_text[:MAX_CERT_MESSAGE - 3].rstrip() + "..."
    
    # Wrap message text to centered block (max 3 lines) using PIL
    message_lines = wrap_text_to_lines_pil(
        draw, message_text, message_font,
        TEXT_WIDTH, MAX_LINES
    )
    
    # ==========================================
    # Print layout info (only in debug mode)
    # ==========================================
    if debug_certificate_layout:
        print("\n=== Certificate Layout (ANCHORED TO DIVIDER) ===")
        print(f"Canvas: {CANVAS_WIDTH} × {CANVAS_HEIGHT} pixels")
        print(f"Center X: {CENTER_X}")
        print(f"Safe margin: {SAFE_MARGIN}px")
        print(f"Debug mode: {debug_certificate_layout}")
        print(f"\nDivider Anchor: Y = {DIVIDER_Y}")
        print(f"\nPhoto (anchored below divider):")
        print(f"  Size: {PHOTO_SIZE}×{PHOTO_SIZE}px, Corner radius: {PHOTO_CORNER_RADIUS}px")
        print(f"  Position: x={PHOTO_X}, y={PHOTO_Y} (top-left corner)")
        print(f"  Offset from divider: {PHOTO_Y - DIVIDER_Y}px")
        print(f"\nName (anchored below photo):")
        print(f"  Y: {NAME_Y}, Font size: {FONT_NAME_SIZE}pt (centered at x={NAME_CENTER_X})")
        print(f"  Offset from photo bottom: {NAME_Y - (PHOTO_Y + PHOTO_SIZE)}px")
        print(f"\nMessage (anchored below name):")
        print(f"  Y: {MESSAGE_Y}, Font size: {FONT_MESSAGE_SIZE}pt, Max width: {TEXT_WIDTH}px")
        print(f"  Line height: {LINE_HEIGHT}px, Max lines: {MAX_LINES}, Max chars: {MAX_CERT_MESSAGE}")
        print(f"  Lines: {len(message_lines)} (centered at x={MESSAGE_CENTER_X})")
        print(f"  Offset from name: {MESSAGE_Y - NAME_Y}px")
        print(f"\nDates (anchored below message - LAST):")
        print(f"  Y: {DATES_Y}, Font size: {FONT_DATES_SIZE}pt, Color: #2f2f2f (centered at x={DATES_CENTER_X})")
        print(f"  Offset from message: {DATES_Y - MESSAGE_Y}px")
        print(f"\nMessage text: {message_text[:60]}..." if len(message_text) > 60 else f"\nMessage text: {message_text}")
        print("================================================\n")
    
    # ==========================================
    # Draw Photo (composed with rounded corners)
    # ==========================================
    if pet_photo_path and os.path.exists(pet_photo_path) and os.path.isfile(pet_photo_path):
        try:
            t1 = time.time()
            # Load and process photo
            with Image.open(pet_photo_path) as photo:
                if photo.mode != "RGB":
                    photo = photo.convert("RGB")
                
                width, height = photo.size
                
                # Center crop to square
                if width > height:
                    left = (width - height) // 2
                    photo = photo.crop((left, 0, left + height, height))
                elif height > width:
                    top = (height - width) // 2
                    photo = photo.crop((0, top, width, top + width))
                
                # Resize to final size
                photo = photo.resize((PHOTO_SIZE, PHOTO_SIZE), Image.LANCZOS)
                
                # Apply subtle edge blur to photo for softer appearance (reduced for performance)
                edge_blur_radius = 1.0  # Reduced from 1.5 to 1.0 for faster processing
                photo = photo.filter(ImageFilter.GaussianBlur(radius=edge_blur_radius))
                
                # Create rounded-rectangle mask
                mask = Image.new("L", (PHOTO_SIZE, PHOTO_SIZE), 0)
                draw_mask = ImageDraw.Draw(mask)
                draw_mask.rounded_rectangle(
                    [(0, 0), (PHOTO_SIZE, PHOTO_SIZE)],
                    radius=PHOTO_CORNER_RADIUS,
                    fill=255
                )
                
                # Apply slight blur to mask edges for smoother transition (reduced for performance)
                mask = mask.filter(ImageFilter.GaussianBlur(radius=0.5))  # Reduced from 0.8 to 0.5
                
                # Optional: Add soft drop shadow (optimized for performance)
                shadow_offset = 12  # Increased from 8 for more depth
                shadow_blur = 8  # Reduced from 12 to 8 for better performance (33% faster blur)
                shadow_opacity = 128  # 50% of 255 (increased from 40% for more visible shadow)
                
                # Create shadow layer (optimized size calculation)
                # Pre-calculate exact bounds to minimize shadow mask size
                shadow_padding = shadow_blur + shadow_offset
                shadow_size = PHOTO_SIZE + shadow_padding * 2
                shadow_mask = Image.new("L", (shadow_size, shadow_size), 0)
                draw_shadow = ImageDraw.Draw(shadow_mask)
                # Draw shadow shape at exact position within mask
                draw_shadow.rounded_rectangle(
                    [(shadow_padding, shadow_padding), 
                     (shadow_padding + PHOTO_SIZE, shadow_padding + PHOTO_SIZE)],
                    radius=PHOTO_CORNER_RADIUS,
                    fill=255
                )
                
                # Apply blur to shadow mask (reduced radius for performance)
                t_blur = time.time()
                shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
                perf_log.append(f"Shadow blur: {time.time() - t_blur:.2f}s")
                
                # Create shadow image with alpha (reduce opacity)
                shadow = Image.new("RGBA", (shadow_size, shadow_size), (0, 0, 0, 0))
                # Apply opacity to mask
                shadow_alpha = shadow_mask.point(lambda p: int(p * shadow_opacity / 255))
                shadow.paste((0, 0, 0), (0, 0), shadow_alpha)
                
                # Paste shadow first (offset by shadow_padding for optimized positioning)
                certificate_image.paste(shadow, (int(PHOTO_X - shadow_padding), int(PHOTO_Y - shadow_padding)), shadow)
                
                # Paste photo with rounded mask
                certificate_image.paste(photo, (int(PHOTO_X), int(PHOTO_Y)), mask)
                perf_log.append(f"Photo processing: {time.time() - t1:.2f}s")
        except Exception as e:
            print(f"Warning: Could not add photo to certificate: {e}")
            import traceback
            traceback.print_exc()
    
    # ==========================================
    # Draw Pet Name (ABSOLUTE position, centered)
    # ==========================================
    if name_font:
        # Get text bounding box for centering
        name_bbox = draw.textbbox((0, 0), pet_name, font=name_font)
        name_width = name_bbox[2] - name_bbox[0]
        name_x = int(NAME_CENTER_X - name_width / 2)
        # PIL text is drawn from top-left at ABSOLUTE Y position
        # Use warm brown color to match embedded template text
        draw.text((name_x, int(NAME_Y)), pet_name, font=name_font, fill=(75, 50, 35))
    else:
        # Fallback if font not loaded
        draw.text((int(NAME_CENTER_X), int(NAME_Y)), pet_name, fill=(75, 50, 35))
    
    # ==========================================
    # Draw Tribute Message (ABSOLUTE position, centered, wrapped, max 3 lines)
    # ==========================================
    if message_font:
        # Draw message lines centered, stacked downward from ABSOLUTE MESSAGE_Y
        for i, line in enumerate(message_lines):
            line_bbox = draw.textbbox((0, 0), line, font=message_font)
            line_width = line_bbox[2] - line_bbox[0]
            line_x = int(MESSAGE_CENTER_X - line_width / 2)
            line_y = int(MESSAGE_Y + (i * LINE_HEIGHT))
            
            if line_y < CANVAS_HEIGHT - SAFE_MARGIN:  # Ensure within safe print zone
                # Use warm brown color to match embedded template text
                draw.text((line_x, line_y), line, font=message_font, fill=(75, 50, 35))
    else:
        # Fallback if font not loaded
        for i, line in enumerate(message_lines):
            line_y = int(MESSAGE_Y + (i * LINE_HEIGHT))
            if line_y < CANVAS_HEIGHT - SAFE_MARGIN:
                # Use warm brown color to match embedded template text
                draw.text((int(MESSAGE_CENTER_X), line_y), line, fill=(75, 50, 35))
    
    # ==========================================
    # Draw Life Dates (centered, lighter color)
    # Dates are positioned below message
    # Use spaced dash (en dash) for dates: 2012 – 2022
    # ==========================================
    # Normalize dates to use en dash (replace hyphens with en dash)
    dates_formatted = life_dates.replace(" - ", " – ").replace("-", " – ")
    
    if dates_font:
        # Get text bounding box for centering
        dates_bbox = draw.textbbox((0, 0), dates_formatted, font=dates_font)
        dates_width = dates_bbox[2] - dates_bbox[0]
        dates_x = int(DATES_CENTER_X - dates_width / 2)
        # PIL text is drawn from top-left at ABSOLUTE DATES_Y position
        # Use warm brown color to match embedded template text (slightly lighter for dates)
        draw.text((dates_x, int(DATES_Y)), dates_formatted, font=dates_font, fill=(80, 55, 40))
    else:
        # Fallback if font not loaded
        draw.text((int(DATES_CENTER_X), int(DATES_Y)), dates_formatted, fill=(80, 55, 40))
    
    # ==========================================
    # Export: Save as PNG (preview) and PDF (download/print)
    # ==========================================
    t_save = time.time()
    # Save PNG first (for preview/web use)
    # Note: Removed optimize=True for faster saves (saves 2-3 seconds)
    png_path = output_path.replace(".pdf", ".png")
    certificate_image.save(png_path, "PNG")
    perf_log.append(f"PNG save: {time.time() - t_save:.2f}s")
    
    # Save PDF from PNG canvas (ensures identical spacing)
    # Use 300 DPI for 8×10 frame printing (standard print resolution)
    t_pdf = time.time()
    certificate_image.save(output_path, "PDF", resolution=300.0)
    perf_log.append(f"PDF save: {time.time() - t_pdf:.2f}s")
    
    total_time = time.time() - start_time
    perf_log.append(f"Total: {total_time:.2f}s")
    print(f"[certificate] Performance: {' | '.join(perf_log)}")
    
    return output_path
