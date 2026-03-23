export interface Wish {
  from: string
  av: string
  color: string
  tag: string
  photo: number | null
  text: string
}

export const WISHES: Wish[] = [
  { from: 'Mum',         av: '💛', color: '#f59e0b', tag: 'Stage 1 Complete! ✨', photo: null, text: "You make every single day brighter just by being you! Happy Birthday! ☀️" },
  { from: 'Dad',         av: '💜', color: '#e879f9', tag: 'Stage 2 Complete! ⚡', photo: null, text: "So proud of you every single day. Keep racing through life! 🚗" },
  { from: 'Sibling',     av: '👦', color: '#6ee7b7', tag: 'Stage 3 Complete! 🏆', photo: null, text: "Happy Birthday! You are the best! Let's play all day! 🎉" },
  { from: 'Grandparent', av: '👵', color: '#c084fc', tag: 'Stage 4 Complete! 🏁', photo: null, text: "Wishing you a wonderful birthday full of joy and laughter! 🌟" },
  { from: 'Family',      av: '🏠', color: '#fca5a5', tag: 'Stage 5 Complete! 🔴', photo: null, text: "The whole family is cheering for you! We love you so much! 💜" },
  { from: 'Best Friend', av: '⭐', color: '#2563eb', tag: 'Stage 6 Complete! 📣', photo: null, text: "You are amazing and today is YOUR day! Happy Birthday champion! 🏆" },
  { from: 'Champion!',   av: '🏆', color: '#f59e0b', tag: '🏁 ALL DONE!',         photo: null, text: "YOU DID IT! You finished every stage! Happy Birthday superstar! 🎂🎊" },
]

export const STARS_NEEDED = [10, 12, 13, 14, 14, 15, 16]
export const STAGE_COLORS = ['#c084fc','#e879f9','#7c3aed','#f59e0b','#2563eb','#f87171','#4f46e5']
export const STAGE_NAMES  = ['Star Valley','Comet Lane','Nebula Road','Halfway Highway','Fan Boulevard','Final Straight',"Champion's End"]
export const STAGE_ICONS  = ['🏁','⛽','⚡','🏆','📣','🔴','👑']
export const BDAY_NOTES: [number, number][] = [
  [261.6,.3],[261.6,.1],[293.7,.4],[261.6,.4],[349.2,.4],[329.6,.8],                                                                                                                                              
  [261.6,.3],[261.6,.1],[293.7,.4],[261.6,.4],[392,.4],[349.2,.8],
  [261.6,.3],[261.6,.1],[523.3,.4],[440,.4],[349.2,.4],[329.6,.4],[293.7,.8],
  [466.2,.3],[466.2,.1],[440,.4],[349.2,.4],[392,.4],[349.2,1],
]
