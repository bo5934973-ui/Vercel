# Jason Qiu Portfolio - Figma Design Spec

## 1. Overall Direction

The site should feel close to an Apple product page: quiet, premium, precise and visual-first. The experience uses large negative space, black/white contrast, soft cool highlights, restrained glass surfaces and large image-led storytelling.

Design keywords:
- Minimal, premium, editorial
- Large visual center
- Black / white / grey foundation
- Soft silver and cool-white light
- Calm motion, no decorative clutter
- Work images as the main subject

## 2. Figma Page Structure

Create these Figma pages:

1. `00 Cover`
2. `01 Design System`
3. `02 Components`
4. `03 Desktop 1440`
5. `04 Tablet 768`
6. `05 Mobile 390`
7. `06 Case Study Template`
8. `07 Prototype Notes`

## 3. Frames

Desktop:
- Width: `1440px`
- Suggested height: `5600px`
- Grid: 12 columns
- Margin: `80px`
- Gutter: `24px`

Tablet:
- Width: `768px`
- Grid: 8 columns
- Margin: `48px`
- Gutter: `20px`

Mobile:
- Width: `390px`
- Grid: 4 columns
- Margin: `24px`
- Gutter: `16px`

## 4. Design System

Colors:
- Background Black: `#050505`
- Background White: `#F5F5F7`
- Text Primary Dark: `#111111`
- Text Primary Light: `#FFFFFF`
- Text Secondary: `#86868B`
- Glass Surface: `rgba(255,255,255,0.08)`
- Hairline Light: `rgba(255,255,255,0.14)`
- Accent Cool White: `#DDEBFF`
- Accent Silver: `#C9CED8`

Gradients:
- Cool Glow: radial `#F8FBFF 0%`, `rgba(184,204,234,.16) 38%`, transparent `70%`
- Product Silver: linear `#FFFFFF`, `#AAB2BE`, `#22262E`
- Glass Overlay: linear `rgba(255,255,255,.16)`, `rgba(255,255,255,.03)`, `rgba(255,255,255,.1)`

Typography:
- English: `SF Pro Display`, `Inter`, `Helvetica Neue`
- Chinese: `PingFang SC`, `Noto Sans SC`

Font scale:
- Hero Title: `72/80` mobile/tablet, `96/96` desktop
- Section Title: `48/56` mobile/tablet, `64/68` desktop
- Card Title: `24/32`
- Body: `16/24`
- Large Body: `24/36`, `32/48`
- Caption: `13/18`

Radius:
- Work image/card: `24px`
- Hero glass object: `32px`
- Buttons/tags: full pill radius

Shadow:
- Soft: `0 30px 100px rgba(12,18,28,0.16)`
- Glass: `0 24px 80px rgba(0,0,0,0.32)`
- Glow: `0 0 80px rgba(190,214,255,0.22)`

## 5. Components

Use Auto Layout for all components.

Navigation Bar:
- Height: `56px`
- Padding desktop: `80px`
- Background: `#050505` at 60% with background blur
- Items: Jason Qiu / Works / About / Contact

Button:
- Height: `44px`
- Horizontal padding: `24px`
- Primary: white fill, black text
- Secondary: glass fill, white text, white 15% border
- Hover: stronger glass or cool-white fill

Tag:
- Pill shape
- Padding: `12px x 4px`
- Text: `13/18`

Hero Section:
- Full viewport height
- Left: title and text stack
- Right: abstract product/glass visual or selected work crop
- Background: black with soft cool radial glow
- CTA row: View Works / Contact Me

Work Card:
- Auto Layout vertical
- Image ratio: around `1.18:1`
- Radius: `24px`
- Image takes primary visual weight
- Text padding: `24-28px`
- Hover: scale image to `1.03`, soft highlight sweep

Case Study Hero:
- Black background
- Project metadata and large title
- 16:9 image hero below

Image Gallery:
- Vertical stack
- 16:9 images
- Gap: `32px`

Contact Section:
- White background
- Center aligned
- Large title
- Email button

Footer:
- Simple two-column text on desktop
- Stacked on mobile

## 6. Desktop Home Layout

1. Navigation
2. Hero
   - H1: `Jason Qiu`
   - Subtitle: `Visual Designer / Brand & Product Design`
   - Chinese intro
   - CTA buttons
   - Abstract product/glass visual
3. Featured Works
   - Section intro
   - 2-column work grid
   - 6 work cards
4. About
   - Left: `About Me`
   - Right: short bio and skill tags
5. Contact
   - Large title
   - Chinese subtitle
   - Email button and email text
6. Footer

## 7. Case Study Template

1. Back to Works
2. Project Hero
   - Category
   - Project name
   - Description
   - Main 16:9 visual
3. Three summary cards
   - Project Background
   - Design Goal
   - Visual Direction
4. Full-width gallery
5. Summary and tags
6. Back to Works button

## 8. Motion Notes

Hero:
- Text moves upward `20-28px` and fades in
- Duration `750-900ms`
- Easing `[0.22, 1, 0.36, 1]`

Work cards:
- Fade up when entering viewport
- Delay each card by `60ms`
- Hover card shadow increases
- Image scale `1.03`
- Highlight sweep moves left to right

Background:
- Cool glow subtly moves with scroll

Buttons:
- Hover increases glass brightness or cool-white fill
- Duration `300ms`

Motion should remain calm, precise and commercial.
