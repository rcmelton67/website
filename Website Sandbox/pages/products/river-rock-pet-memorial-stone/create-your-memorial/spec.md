---
page_name: River Rock Memorial Builder
slug: river-rock-pet-memorial-stone/create-your-memorial
parent: river-rock-pet-memorial-stone
page_type: product_builder
indexing: noindex, follow
---

# Purpose

Interactive builder page for creating custom river rock pet memorial stones. Allows customers to select size, enter memorial details, and customize their order.

# SEO

title: Create Your River Rock Pet Memorial | Melton Memorials
meta_description: Design your natural river rock pet memorial. Choose size, layout, and personalization details. Each stone is hand-selected for its organic shape and unique river rock character, perfect for garden placement. Proof provided before engraving.
canonical: /products/river-rock-pet-memorial-stone/

# Builder Flow

step_1: size_selection
step_2: memorial_details
step_3: layout_selection (if applicable)
step_4: review_and_add_to_cart

# Pricing

display_anchor: From $22
default_size: 7x4
sizes:
  - 3x2:
      price: 22
  - 7x4:
      price: 56
  - 10x6:
      price: 82
  - 12x8:
      price: 108

# Memorial Fields

required:
  - pet_name
  - size
optional:
  - years_of_life
  - pet_type
  - custom_message
  - layout_choice

# Proof Policy

message: >
  A detailed engraving proof will be emailed within 3 business days
  for approval or requested revisions before production begins.

# UI Rules

layout: two_column
image_position: left
image_swap_on_size_change: true
default_selected_size: 7x4
live_preview: false
preview_confirmation_checkbox: false

# Technical Notes

- Uses granite preview images as placeholder (needs river rock specific images)
- Form submission should pass to WooCommerce or order system
- Noindex tag prevents search indexing (builder page)

# Content Sections

1. Breadcrumbs
2. H1: Create Your River Rock Pet Memorial
3. Builder Layout:
   - Left: Image Preview
   - Right: Builder Form (size selection, memorial details, CTA)
4. Proof Notice
