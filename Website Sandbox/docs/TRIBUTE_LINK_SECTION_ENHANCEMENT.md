# Tribute Link Section Enhancement

## Summary
- Visual separator (border-top, margin/padding) on `.tribute-links`
- Bold product link; margin-bottom between subsections
- Pet-type link: Dog â†’ /pages/dog-memorial-stones/, Cat â†’ /pages/cat-memorial-stones/, default â†’ granite product

## Files Modified
- Website Sandbox/assets/css/tribute.css â€” appended styles
- Website Sandbox/templates/tribute-template.html â€” tribute-links wrapper + tribute-pet-type-link section
- Website Sandbox/tools/tribute-publisher/templates/tribute_content.html â€” same
- tribute_publisher/tribute_publisher.py â€” PET_TYPE / PET_TYPE_LINK replacement
- Website Sandbox/tools/tribute-publisher/tribute_publisher.py â€” same
- memorials/pet-tributes/*/index.html â€” pet-type block inserted (9 slugs)

## Generator Logic
pt_combined = pet_type + breed (lower). dog in combined â†’ Dog + dog-memorial-stones; cat â†’ Cat + cat-memorial-stones; else Pet + granite-pet-memorial-stone.

## Slugs Updated
brownie-dog-mixed-breed, kira-siberian-husky-2012-2020, lucy-dog-great-pyrenees, mimi-dog-french-bulldog, miss-molly-dachshund-2010-2026, missy-dog-rescue-dog, phoebe-dog-american-akita, ryley-dog-english-springer-spaniel, woodland-cat
