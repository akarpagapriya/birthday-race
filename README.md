# ⚡ Lightning Kabileshwar – Birthday Race!

A 7-stage birthday racing game built with Next.js for Kabileshwar's 6th Birthday! 🎂🚗

## 🚀 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## 🌐 Deploy to Vercel (Free Hosting)

### Option A — Vercel CLI (easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the project folder
vercel

# Follow the prompts — it will give you a live URL!
```

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com and sign in
3. Click "Add New Project"
4. Import your GitHub repo
5. Click Deploy — done! 🎉

## 📸 Adding Kabileshwar's Photos

In `src/components/Game.tsx`, find the wish overlay section.
Replace the photo placeholder div with:
```tsx
<img src="/photo1.jpg" alt="Kabileshwar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
```
Put the actual image files in the `/public` folder as:
- `photo1.jpg` → Paati Gunasekari stage
- `photo2.jpg` → Amma Karpagapriya stage
- `photo3.jpg` → Amma Durgadevi stage
- `photo4.jpg` → Brother Nimaleshwar stage
- `photo5.jpg` → Baby Sister Maadhangi stage

## 🎮 Controls
- **Desktop**: ← → Arrow keys
- **Mobile**: Tap the ◀ ▶ buttons on screen

## 🏗️ Project Structure
```
src/
  app/
    layout.tsx      ← Root layout + fonts
    page.tsx        ← Entry point
    globals.css     ← Global styles + animations
  components/
    Game.tsx        ← Main game component (all screens)
    gameData.ts     ← Wishes, stage config, constants
    audio.ts        ← Web Audio sound effects
    drawUtils.ts    ← Canvas drawing: car, stars, obstacles, road
```

Happy Birthday Kabileshwar! ⚡🏆
