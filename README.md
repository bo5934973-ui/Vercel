# Jason Qiu Portfolio

Apple-inspired personal portfolio website for a visual designer focused on brand visual design, e-commerce design, product rendering, AI visual direction and smart hardware visuals.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Framer Motion
- Lucide React

## Project Structure

```text
app/
components/
sections/
data/
public/works/
styles/
docs/
```

## Replace Works

Edit `data/works.js`.

Each work contains:

```js
{
  title,
  category,
  year,
  description,
  coverImage,
  images,
  tags,
  slug
}
```

Put real work images into `public/works`, then update `coverImage` and `images`.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel Deploy

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Build command: `npm run build`
- Output directory: leave empty
- Install command: `npm install`

Create and connect a Vercel Blob store, then add this environment variable:

```text
ADMIN_PASSWORD=your-admin-password
```

See `docs/vercel-deploy.md` for the full checklist.

## Figma

Use `docs/figma-spec.md` as the Figma build guide. The implemented components match the spec names and layout logic, so the site can be recreated as Figma frames with Auto Layout.
