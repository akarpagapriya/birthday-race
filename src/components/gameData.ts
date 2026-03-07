export interface Wish {
  from: string
  av: string
  color: string
  tag: string
  photo?: number | string
  text: string
}

export const WISHES: Wish[] = [
  {
    from: 'Paati Gunasekari', av: '👵', color: '#c084fc',
    tag: 'Stage 1 Complete! 🏁', photo: 1,
    text: "My dearest Kabileshwar, you are the brightest star in our family sky! Paati loves you more than all the stars in this game put together. Happy 6th Birthday, my little champion! 🌟💜"
  },
  {
    from: 'Amma Karpagapriya', av: '💛', color: '#fde68a',
    tag: 'Stage 2 Complete! ✨', photo: 2,
    text: "Kabi my love, you came into my life and made everything perfect. Watching you grow into this amazing little racer fills my heart with so much joy. I love you more than words can say. Happy Birthday, my sunshine! ☀️💛"
  },
  {
    from: 'Amma Durgadevi', av: '💜', color: '#e879f9',
    tag: 'Stage 3 Complete! ⚡', photo: 3,
    text: "My sweet Kabileshwar, you know you have two mummies who love you endlessly! You make every day so special just by being you. Zoom through life always — we'll always be cheering for you! 💜🚗"
  },
  {
    from: 'Brother Nimaleshwar', av: '👦', color: '#6ee7b7',
    tag: 'Stage 4 Complete! 🏆', photo: 4,
    text: "Anna Kabi! You're the coolest! Let's race our toy cars forever and ever! I'm SO happy you're my brother. Happy Birthday, let's play ALL day today! 🚗🚕💚"
  },
  {
    from: 'Baby Sister Maadhangi', av: '👶', color: '#93c5fd',
    tag: 'Stage 5 Complete! 📣', photo: 5,
    text: "Boo boo baa! 🍼 (That means: Anna Kabileshwar, I don't know much yet — but I already know you are the BEST big brother in the whole world! I love you so much! 💙👶)"
  },
  {
    from: 'The Whole Family 🏠', av: '🏠', color: '#fca5a5',
    tag: 'Stage 6 Complete! 🔴', photo: undefined,
    text: "Gunasekari, Karpagapriya, Durgadevi, Nimaleshwar & little Maadhangi — ALL of us say: Kabileshwar, you are our greatest joy, our loudest laugh, our warmest hug. We love you endlessly! 🌺💜"
  },
  {
    from: '⚡ Lightning Kabileshwar', av: '🏆', color: '#fde68a',
    tag: '🏁 CHAMPION! All 7 Done!', photo: undefined,
    text: "YOU DID IT! You finished all 7 stages and collected every family wish! You are not just ⚡ Lightning Kabileshwar the racer — you are the most loved, most wonderful 6-year-old in the whole universe. HAPPY BIRTHDAY! 🎂🎊🚗⭐🏆"
  },
]

export const STARS_NEEDED = [10, 12, 13, 14, 14, 15, 16]
export const STAGE_COLORS = ['#c084fc','#e879f9','#a78bfa','#fde68a','#93c5fd','#f87171','#d8b4fe']
export const STAGE_NAMES  = ['Star Valley','Comet Lane','Nebula Road','Halfway Highway','Fan Boulevard','Final Straight',"Champion's End"]
export const STAGE_ICONS  = ['🏁','⛽','⚡','🏆','📣','🔴','👑']
export const BDAY_NOTES: [number, number][] = [
  [261.6,.3],[261.6,.1],[293.7,.4],[261.6,.4],[349.2,.4],[329.6,.8],
  [261.6,.3],[261.6,.1],[293.7,.4],[261.6,.4],[392,.4],[349.2,.8],
  [261.6,.3],[261.6,.1],[523.3,.4],[440,.4],[349.2,.4],[329.6,.4],[293.7,.8],
  [466.2,.3],[466.2,.1],[440,.4],[349.2,.4],[392,.4],[349.2,1],
]
