# Accessibility test checklist

Site: https://allankoaik.github.io/quote-calculator/

## Before you start

- Install NVDA (free) from nvaccess.org and start it. The **NVDA key** is `Insert` (or `Caps Lock` if you choose that).
- Use Chrome, Edge or Firefox. Close other tabs.
- Stop NVDA talking at any time: press `Ctrl`.
- Useful keys: `Tab` / `Shift+Tab` move between controls, `H` jumps between headings, `D` between landmarks, `F` between form fields, `NVDA+F7` lists headings, links and landmarks.

Tick each box and note anything odd in the **Notes** column.

## 1. Keyboard only (no NVDA, no mouse)

| ✓ | Check | Expected | Notes |
|---|---|---|---|
| ☐ | Press `Tab` once after the page loads | "Skip to main content" link appears top-left | |
| ☐ | Press `Enter` on it | Focus jumps to the main content | |
| ☐ | Keep pressing `Tab` | A clear blue outline shows on every control, in a logical order (top to bottom, left column then the estimate) | |
| ☐ | In "Type of clean", use the arrow keys | The selection moves and the total updates | |
| ☐ | Bedrooms/bathrooms: use arrow keys | The value changes and the total updates | |
| ☐ | Extras: press `Space` on each | Ticks and unticks, and the total updates | |
| ☐ | Press "Request this quote" with empty details | Focus jumps to "Full name", red error messages appear | |
| ☐ | Fill everything in and submit | The confirmation appears and focus moves to its heading | |
| ☐ | Press "Start a new quote" | Form comes back, reset to $80.00 | |

## 2. Screen reader (NVDA on)

| ✓ | Check | Expected NVDA says (roughly) | Notes |
|---|---|---|---|
| ☐ | Load the page | Page title: "Instant Cleaning Quote, Tidewater Cleaning Co." | |
| ☐ | `NVDA+F7`, then Headings | "Get an instant cleaning quote", "Quote options and booking request", "Your estimate" | |
| ☐ | `NVDA+F7`, then Landmarks | banner, main, form, complementary, content info | |
| ☐ | `Tab` into "Type of clean" | "1. Type of clean, grouping, Standard clean $80 … radio button, checked, 1 of 3" | |
| ☐ | Arrow to "Deep clean" | Reads "Deep clean $140" plus the description, then a moment later the **new total "$140.00"** | |
| ☐ | Tab to Bedrooms | "Bedrooms, combo box, 1, First one included, then $20 each" | |
| ☐ | Tick "Inside the oven" | "checked", then the new total is announced | |
| ☐ | Choose "Every week" | Reads "Save 15%", then the discounted total | |
| ☐ | Tab to Full name | "Full name, edit, required" (the * is not read out) | |
| ☐ | Leave Full name empty and press `Tab` | After a short pause: "Full name: Error: Enter your full name." | |
| ☐ | Shift+Tab back to Full name | Now also says "invalid entry" and reads the error | |
| ☐ | Type a name, Tab away | No error is read any more | |
| ☐ | Email: type "abc" and Tab | "Email: Error: Enter an email address, like name@example.com." | |
| ☐ | Date field | "Preferred date … We can book from tomorrow onwards." | |
| ☐ | Submit with everything valid | Reads "Your request is in", heading level 2 | |
| ☐ | Read the confirmation (`Down arrow`) | "Thanks, [name]. We'll email … to confirm your $… clean on [date]." | |

## 3. Zoom, mobile and display settings

| ✓ | Check | Expected | Notes |
|---|---|---|---|
| ☐ | Zoom the browser to 200% (`Ctrl` and `+`) | Single column, nothing cut off, no sideways scrolling | |
| ☐ | Zoom to 400% | Still readable, no sideways scrolling | |
| ☐ | Open on a phone | Everything fits, buttons easy to tap, form fields don't zoom the page | |
| ☐ | Turn on Windows dark mode | Dark colours, all text still easy to read | |
| ☐ | Windows Contrast themes (Settings > Accessibility > Contrast themes) | Borders, focus outlines and radio/checkbox states still visible | |

## Results

Date tested:            Browser:            NVDA version:

Issues found:
