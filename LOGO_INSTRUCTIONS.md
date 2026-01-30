# Adding Your MartialDev Logo

Your site currently uses an SVG placeholder logo. To use your actual PNG logo image:

## Steps:

1. **Save your logo image**
   - Save your MartialDev logo PNG file as: `public/logo.png`

2. **Update the HTML file** (Optional - if you prefer PNG over SVG)
   - Open `public/index.html`
   - Find and replace all instances of `logo.svg` with `logo.png`
   - There are 3 locations:
     - Line 7: favicon link
     - Line 24: navigation logo
     - Line 115: footer logo

3. **Update favicon format** (if using PNG)
   - Change: `<link rel="icon" type="image/svg+xml" href="/logo.svg">`
   - To: `<link rel="icon" type="image/png" href="/logo.png">`

## Current Logo Location:
- SVG version: `public/logo.svg`
- PNG version (to add): `public/logo.png`

The SVG logo is designed to match your branding with:
- Blue "Martial" text
- Red "Dev" text
- Black background
- Glowing effects

You can keep the SVG or replace it with your PNG - both will work!
