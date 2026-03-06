module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://taxffmrcwgwaqmcswcgg.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheGZmbXJjd2d3YXFtY3N3Y2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQwOTcsImV4cCI6MjA4ODM3MDA5N30.8olLyStkvJlFEK96HHXY1S5zMzHwviVDJZa5wWr-wfc");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
}),
"[project]/src/lib/gameService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadGame",
    ()=>loadGame,
    "saveGame",
    ()=>saveGame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
function generateSlug(name) {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 6);
    return `${clean}-${year}-${rand}`;
}
async function uploadPhoto(file, slug, stage) {
    const ext = file.name.split('.').pop();
    const path = `${slug}/stage-${stage}.${ext}`;
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('photos').upload(path, file, {
        upsert: true
    });
    if (error) {
        console.error('Photo upload error:', error);
        return null;
    }
    const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('photos').getPublicUrl(path);
    return data.publicUrl;
}
async function saveGame(state) {
    try {
        const slug = generateSlug(state.child_name);
        // 1. Insert game row
        const { data: game, error: gameError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('games').insert({
            slug,
            child_name: state.child_name,
            age: state.age,
            theme_color: state.theme_color
        }).select().single();
        if (gameError || !game) {
            console.error('Game insert error:', gameError);
            return null;
        }
        // 2. Upload photos + insert wishes
        const wishRows = await Promise.all(state.wishes.map(async (w)=>{
            let photo_url = null;
            if (w.photo_file) {
                photo_url = await uploadPhoto(w.photo_file, slug, w.stage);
            }
            return {
                game_id: game.id,
                stage: w.stage,
                from_name: w.from_name,
                avatar: w.avatar,
                short_wish: w.short_wish,
                photo_url
            };
        }));
        const { error: wishError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('wishes').insert(wishRows);
        if (wishError) {
            console.error('Wishes insert error:', wishError);
            return null;
        }
        return slug;
    } catch (e) {
        console.error('saveGame error:', e);
        return null;
    }
}
async function loadGame(slug) {
    const { data: game, error: gameError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('games').select('*').eq('slug', slug).single();
    if (gameError || !game) return null;
    const { data: wishes, error: wishError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('wishes').select('*').eq('game_id', game.id).order('stage', {
        ascending: true
    });
    if (wishError) return null;
    return {
        game,
        wishes
    };
}
}),
"[project]/src/components/gameData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BDAY_NOTES",
    ()=>BDAY_NOTES,
    "STAGE_COLORS",
    ()=>STAGE_COLORS,
    "STAGE_ICONS",
    ()=>STAGE_ICONS,
    "STAGE_NAMES",
    ()=>STAGE_NAMES,
    "STARS_NEEDED",
    ()=>STARS_NEEDED,
    "WISHES",
    ()=>WISHES
]);
const WISHES = [
    {
        from: 'Paati Gunasekari',
        av: '👵',
        color: '#c084fc',
        tag: 'Stage 1 Complete! 🏁',
        photo: 1,
        text: "My dearest Kabileshwar, you are the brightest star in our family sky! Paati loves you more than all the stars in this game put together. Happy 6th Birthday, my little champion! 🌟💜"
    },
    {
        from: 'Amma Karpagapriya',
        av: '💛',
        color: '#fde68a',
        tag: 'Stage 2 Complete! ✨',
        photo: 2,
        text: "Kabi my love, you came into my life and made everything perfect. Watching you grow into this amazing little racer fills my heart with so much joy. I love you more than words can say. Happy Birthday, my sunshine! ☀️💛"
    },
    {
        from: 'Amma Durgadevi',
        av: '💜',
        color: '#e879f9',
        tag: 'Stage 3 Complete! ⚡',
        photo: 3,
        text: "My sweet Kabileshwar, you know you have two mummies who love you endlessly! You make every day so special just by being you. Zoom through life always — we'll always be cheering for you! 💜🚗"
    },
    {
        from: 'Brother Nimaleshwar',
        av: '👦',
        color: '#6ee7b7',
        tag: 'Stage 4 Complete! 🏆',
        photo: 4,
        text: "Anna Kabi! You're the coolest! Let's race our toy cars forever and ever! I'm SO happy you're my brother. Happy Birthday, let's play ALL day today! 🚗🚕💚"
    },
    {
        from: 'Baby Sister Maadhangi',
        av: '👶',
        color: '#93c5fd',
        tag: 'Stage 5 Complete! 📣',
        photo: 5,
        text: "Boo boo baa! 🍼 (That means: Anna Kabileshwar, I don't know much yet — but I already know you are the BEST big brother in the whole world! I love you so much! 💙👶)"
    },
    {
        from: 'The Whole Family 🏠',
        av: '🏠',
        color: '#fca5a5',
        tag: 'Stage 6 Complete! 🔴',
        photo: null,
        text: "Gunasekari, Karpagapriya, Durgadevi, Nimaleshwar & little Maadhangi — ALL of us say: Kabileshwar, you are our greatest joy, our loudest laugh, our warmest hug. We love you endlessly! 🌺💜"
    },
    {
        from: '⚡ Lightning Kabileshwar',
        av: '🏆',
        color: '#fde68a',
        tag: '🏁 CHAMPION! All 7 Done!',
        photo: null,
        text: "YOU DID IT! You finished all 7 stages and collected every family wish! You are not just ⚡ Lightning Kabileshwar the racer — you are the most loved, most wonderful 6-year-old in the whole universe. HAPPY BIRTHDAY! 🎂🎊🚗⭐🏆"
    }
];
const STARS_NEEDED = [
    10,
    12,
    13,
    14,
    14,
    15,
    16
];
const STAGE_COLORS = [
    '#c084fc',
    '#e879f9',
    '#a78bfa',
    '#fde68a',
    '#93c5fd',
    '#f87171',
    '#d8b4fe'
];
const STAGE_NAMES = [
    'Star Valley',
    'Comet Lane',
    'Nebula Road',
    'Halfway Highway',
    'Fan Boulevard',
    'Final Straight',
    "Champion's End"
];
const STAGE_ICONS = [
    '🏁',
    '⛽',
    '⚡',
    '🏆',
    '📣',
    '🔴',
    '👑'
];
const BDAY_NOTES = [
    [
        261.6,
        .3
    ],
    [
        261.6,
        .1
    ],
    [
        293.7,
        .4
    ],
    [
        261.6,
        .4
    ],
    [
        349.2,
        .4
    ],
    [
        329.6,
        .8
    ],
    [
        261.6,
        .3
    ],
    [
        261.6,
        .1
    ],
    [
        293.7,
        .4
    ],
    [
        261.6,
        .4
    ],
    [
        392,
        .4
    ],
    [
        349.2,
        .8
    ],
    [
        261.6,
        .3
    ],
    [
        261.6,
        .1
    ],
    [
        523.3,
        .4
    ],
    [
        440,
        .4
    ],
    [
        349.2,
        .4
    ],
    [
        329.6,
        .4
    ],
    [
        293.7,
        .8
    ],
    [
        466.2,
        .3
    ],
    [
        466.2,
        .1
    ],
    [
        440,
        .4
    ],
    [
        349.2,
        .4
    ],
    [
        392,
        .4
    ],
    [
        349.2,
        1
    ]
];
}),
"[project]/src/components/audio.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sndBday",
    ()=>sndBday,
    "sndCollect",
    ()=>sndCollect,
    "sndCrash",
    ()=>sndCrash,
    "sndRev",
    ()=>sndRev,
    "sndWin",
    ()=>sndWin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gameData.ts [app-ssr] (ecmascript)");
;
let audioCtx = null;
function getAC() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}
function tone(freq, dur, type = 'sine', vol = 0.18) {
    try {
        const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(c.destination);
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(vol, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
        o.start();
        o.stop(c.currentTime + dur + 0.02);
    } catch  {}
}
function sndCollect() {
    tone(1047, .08);
    setTimeout(()=>tone(1319, .1), 80);
}
function sndCrash() {
    try {
        const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(c.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(200, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(35, c.currentTime + .35);
        g.gain.setValueAtTime(0.22, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + .4);
        o.start();
        o.stop(c.currentTime + .45);
    } catch  {}
}
function sndWin() {
    [
        523,
        659,
        784,
        1047,
        1319,
        1568
    ].forEach((f, i)=>setTimeout(()=>tone(f, .3, 'sine', .22), i * 100));
}
function sndRev() {
    try {
        const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(c.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(70, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(260, c.currentTime + .18);
        o.frequency.exponentialRampToValueAtTime(90, c.currentTime + .42);
        g.gain.setValueAtTime(0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + .45);
        o.start();
        o.stop(c.currentTime + .5);
    } catch  {}
}
function sndBday() {
    try {
        const c = getAC();
        let t = c.currentTime + .1;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BDAY_NOTES"].forEach(([f, d])=>{
            const o = c.createOscillator(), g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = 'sine';
            o.frequency.value = f;
            g.gain.setValueAtTime(.2, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + d);
            o.start(t);
            o.stop(t + d + .05);
            t += d + .02;
        });
    } catch  {}
}
}),
"[project]/src/components/drawUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "drawObstacle",
    ()=>drawObstacle,
    "drawRoad",
    ()=>drawRoad,
    "drawSpaceBg",
    ()=>drawSpaceBg,
    "drawStar3D",
    ()=>drawStar3D,
    "drawToycar",
    ()=>drawToycar
]);
function drawSpaceBg(ctx, W, H, bgStars, stageColor, bgTimer) {
    ctx.fillStyle = '#080010';
    ctx.fillRect(0, 0, W, H);
    bgStars.forEach((s)=>{
        ctx.beginPath();
        ctx.arc(s.x / 1200 * W, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${s.op})`;
        ctx.fill();
    });
    if (bgTimer % 200 === 0) {
        const nx = Math.random() * W, ny = Math.random() * H * .8, nr = 40 + Math.random() * 80;
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        ng.addColorStop(0, stageColor + '18');
        ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawRoad(ctx, W, H, roadScroll, stageColor, stageName) {
    const rL = W * .12, rR = W * .88, rW = rR - rL;
    const rg = ctx.createLinearGradient(rL, 0, rR, 0);
    rg.addColorStop(0, '#0e0020');
    rg.addColorStop(.15, '#160030');
    rg.addColorStop(.5, '#1e0040');
    rg.addColorStop(.85, '#160030');
    rg.addColorStop(1, '#0e0020');
    ctx.fillStyle = rg;
    ctx.fillRect(rL, 0, rW, H);
    [
        rL,
        rR
    ].forEach((ex)=>{
        const eg = ctx.createLinearGradient(ex - 5, 0, ex + 5, 0);
        eg.addColorStop(0, 'transparent');
        eg.addColorStop(.5, stageColor + 'bb');
        eg.addColorStop(1, 'transparent');
        ctx.fillStyle = eg;
        ctx.fillRect(ex - 4, 0, 8, H);
    });
    ctx.setLineDash([
        36,
        24
    ]);
    ctx.lineDashOffset = -roadScroll;
    ctx.strokeStyle = 'rgba(196,181,253,0.14)';
    ctx.lineWidth = 2;
    [
        rL + rW / 3,
        rL + rW * 2 / 3
    ].forEach((lx)=>{
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, H);
        ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.save();
    ctx.font = `bold ${Math.max(14, W * .032)}px 'Racing Sans One',cursive`;
    ctx.fillStyle = 'rgba(255,255,255,0.022)';
    ctx.textAlign = 'center';
    ctx.fillText(stageName, W / 2, H * .5);
    ctx.restore();
}
function drawToycar(ctx, x, y, w, h, stageColor) {
    const cw = w * 1.5;
    ctx.save();
    // ground shadow
    const sg = ctx.createRadialGradient(x, y + h * .52, 0, x, y + h * .52, cw * .75);
    sg.addColorStop(0, 'rgba(0,0,0,0.45)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(x, y + h * .53, cw * .7, h * .1, 0, 0, Math.PI * 2);
    ctx.fill();
    // engine glow
    const eg = ctx.createRadialGradient(x, y + h * .2, 0, x, y + h * .2, cw);
    eg.addColorStop(0, stageColor + '50');
    eg.addColorStop(1, 'transparent');
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.ellipse(x, y + h * .2, cw, h * .55, 0, 0, Math.PI * 2);
    ctx.fill();
    // chassis
    ctx.save();
    ctx.shadowColor = stageColor;
    ctx.shadowBlur = 20;
    const cg = ctx.createLinearGradient(x - cw * .5, y + h * .05, x + cw * .5, y + h * .5);
    cg.addColorStop(0, '#ff3a6e');
    cg.addColorStop(.3, '#e81060');
    cg.addColorStop(.7, '#c0004a');
    cg.addColorStop(1, '#7a0030');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.moveTo(x - cw * .48, y + h * .48);
    ctx.lineTo(x - cw * .52, y + h * .08);
    ctx.quadraticCurveTo(x - cw * .52, y - h * .02, x - cw * .4, y - h * .02);
    ctx.lineTo(x + cw * .4, y - h * .02);
    ctx.quadraticCurveTo(x + cw * .52, y - h * .02, x + cw * .52, y + h * .08);
    ctx.lineTo(x + cw * .48, y + h * .48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // cabin roof
    ctx.save();
    const rg = ctx.createLinearGradient(x - cw * .28, y - h * .5, x + cw * .28, y + h * .02);
    rg.addColorStop(0, '#ff7aaa');
    rg.addColorStop(.4, '#e8105e');
    rg.addColorStop(1, '#a0003e');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.moveTo(x - cw * .25, y - h * .02);
    ctx.lineTo(x - cw * .32, y - h * .38);
    ctx.quadraticCurveTo(x - cw * .30, y - h * .52, x - cw * .15, y - h * .52);
    ctx.lineTo(x + cw * .15, y - h * .52);
    ctx.quadraticCurveTo(x + cw * .30, y - h * .52, x + cw * .32, y - h * .38);
    ctx.lineTo(x + cw * .25, y - h * .02);
    ctx.closePath();
    ctx.fill();
    // cabin highlight
    ctx.fillStyle = 'rgba(255,200,220,0.18)';
    ctx.beginPath();
    ctx.moveTo(x - cw * .23, y - h * .04);
    ctx.lineTo(x - cw * .28, y - h * .35);
    ctx.lineTo(x - cw * .12, y - h * .35);
    ctx.lineTo(x - cw * .1, y - h * .04);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // windshield
    const wg = ctx.createLinearGradient(x, y - h * .5, x, y - h * .05);
    wg.addColorStop(0, 'rgba(180,240,255,0.78)');
    wg.addColorStop(.4, 'rgba(100,200,255,0.55)');
    wg.addColorStop(1, 'rgba(30,80,200,0.3)');
    ctx.fillStyle = wg;
    ctx.beginPath();
    ctx.moveTo(x - cw * .26, y - h * .04);
    ctx.lineTo(x - cw * .3, y - h * .36);
    ctx.lineTo(x + cw * .3, y - h * .36);
    ctx.lineTo(x + cw * .26, y - h * .04);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - cw * .22, y - h * .06);
    ctx.lineTo(x - cw * .26, y - h * .32);
    ctx.stroke();
    [
        [
            x - cw * .38,
            y - h * .28,
            cw * .09,
            h * .18
        ],
        [
            x + cw * .29,
            y - h * .28,
            cw * .09,
            h * .18
        ]
    ].forEach(([wx, wy, ww, wh])=>{
        ctx.fillStyle = 'rgba(120,200,255,0.4)';
        ctx.beginPath();
        ctx.roundRect(wx, wy, ww, wh, 3);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    // hood stripes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    [
        x - cw * .1,
        x + cw * .1
    ].forEach((sx)=>{
        ctx.beginPath();
        ctx.moveTo(sx, y - h * .02);
        ctx.lineTo(sx, y + h * .35);
        ctx.stroke();
    });
    // lightning decal
    ctx.fillStyle = 'rgba(255,230,0,0.85)';
    ctx.shadowColor = '#FFD600';
    ctx.shadowBlur = 10;
    ctx.font = `bold ${Math.max(9, cw * .22)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', x, y + h * .15);
    // racing number
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.roundRect(x + cw * .15, y - h * .01, cw * .22, h * .28, 4);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(8, cw * .18)}px 'Boogaloo',cursive`;
    ctx.fillText('6', x + cw * .26, y + h * .13);
    [
        [
            x - cw * .34,
            y - h * .5
        ],
        [
            x + cw * .34,
            y - h * .5
        ]
    ].forEach(([lx, ly])=>{
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.roundRect(lx - cw * .09, ly, cw * .18, h * .1, 3);
        ctx.fill();
        const lg = ctx.createRadialGradient(lx, ly + h * .05, 0, lx, ly + h * .05, cw * .1);
        lg.addColorStop(0, 'rgba(255,255,210,1)');
        lg.addColorStop(.5, 'rgba(255,210,80,0.8)');
        lg.addColorStop(1, 'rgba(255,140,0,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(lx, ly + h * .05, cw * .1, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.globalAlpha = 0.1;
        const bg = ctx.createRadialGradient(lx, ly - h * .08, 0, lx, ly - h * .08, cw * .55);
        bg.addColorStop(0, 'rgba(255,255,180,1)');
        bg.addColorStop(1, 'transparent');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(lx, ly - h * .08, cw * .55, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    [
        [
            x - cw * .36,
            y + h * .44
        ],
        [
            x + cw * .36,
            y + h * .44
        ]
    ].forEach(([lx, ly])=>{
        ctx.fillStyle = '#ff2200';
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(lx - cw * .07, ly - h * .04, cw * .14, h * .07, 2);
        ctx.fill();
    });
    // wheels
    const wr = cw * .13;
    [
        [
            x - cw * .44,
            y + h * .28
        ],
        [
            x + cw * .44,
            y + h * .28
        ],
        [
            x - cw * .44,
            y + h * .42
        ],
        [
            x + cw * .44,
            y + h * .42
        ]
    ].forEach(([wx, wy])=>{
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(wx, wy, wr, 0, Math.PI * 2);
        ctx.fillStyle = '#0d0020';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wx, wy, wr, 0, Math.PI * 2);
        ctx.strokeStyle = '#2a0050';
        ctx.lineWidth = wr * .28;
        ctx.stroke();
        const rimG = ctx.createRadialGradient(wx - wr * .15, wy - wr * .15, 0, wx, wy, wr * .72);
        rimG.addColorStop(0, 'rgba(255,255,255,0.9)');
        rimG.addColorStop(.3, stageColor + 'dd');
        rimG.addColorStop(.7, 'rgba(100,0,200,0.5)');
        rimG.addColorStop(1, 'rgba(40,0,80,0.4)');
        ctx.beginPath();
        ctx.arc(wx, wy, wr * .72, 0, Math.PI * 2);
        ctx.fillStyle = rimG;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wx, wy, wr * .28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = wr * .1;
        for(let s = 0; s < 4; s++){
            const a = s * Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(wx + Math.cos(a) * wr * .28, wy + Math.sin(a) * wr * .28);
            ctx.lineTo(wx + Math.cos(a) * wr * .68, wy + Math.sin(a) * wr * .68);
            ctx.stroke();
        }
        ctx.restore();
    });
    ctx.restore();
}
function drawStar3D(ctx, x, y, r, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(spin);
    const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.8);
    gg.addColorStop(0, 'rgba(255,220,80,0.55)');
    gg.addColorStop(.5, 'rgba(255,180,0,0.2)');
    gg.addColorStop(1, 'transparent');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2);
    ctx.fill();
    const pts = 5, outer = r, inner = r * .42;
    ctx.beginPath();
    for(let i = 0; i < pts * 2; i++){
        const a = i * Math.PI / pts - Math.PI / 2;
        const dist = i % 2 === 0 ? outer : inner;
        i === 0 ? ctx.moveTo(Math.cos(a) * dist, Math.sin(a) * dist) : ctx.lineTo(Math.cos(a) * dist, Math.sin(a) * dist);
    }
    ctx.closePath();
    const sg = ctx.createLinearGradient(-r, -r, r, r);
    sg.addColorStop(0, '#fffde4');
    sg.addColorStop(.25, '#ffe066');
    sg.addColorStop(.6, '#f59e0b');
    sg.addColorStop(1, '#92400e');
    ctx.fillStyle = sg;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-r * .18, -r * .22, r * .22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * .08, r * .08, r * .1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
    ctx.restore();
}
function drawObstacle(ctx, x, y, r, type) {
    if (type === 'rock') {
        ctx.save();
        ctx.translate(x, y);
        const sg = ctx.createRadialGradient(0, r * .6, 0, 0, r * .6, r * .8);
        sg.addColorStop(0, 'rgba(0,0,0,0.3)');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(0, r * .6, r * .8, r * .25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-r * .6, r * .3);
        ctx.lineTo(-r * .75, -r * .1);
        ctx.lineTo(-r * .4, -r * .55);
        ctx.lineTo(r * .1, -r * .7);
        ctx.lineTo(r * .65, -r * .35);
        ctx.lineTo(r * .7, r * .25);
        ctx.lineTo(r * .35, r * .55);
        ctx.lineTo(-r * .3, r * .6);
        ctx.closePath();
        const rg = ctx.createLinearGradient(-r, -r, r, r);
        rg.addColorStop(0, '#9ca3af');
        rg.addColorStop(.4, '#6b7280');
        rg.addColorStop(1, '#1f2937');
        ctx.fillStyle = rg;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-r * .3, -r * .5);
        ctx.lineTo(r * .1, -r * .65);
        ctx.lineTo(r * .5, -r * .3);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    } else if (type === 'barrier') {
        ctx.save();
        ctx.translate(x, y);
        const pg = ctx.createLinearGradient(-r * .08, 0, r * .08, 0);
        pg.addColorStop(0, '#6b7280');
        pg.addColorStop(.4, '#d1d5db');
        pg.addColorStop(1, '#374151');
        ctx.fillStyle = pg;
        ctx.fillRect(-r * .06, -r * .5, r * .12, r);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-r * .5, -r * .5, r, r * .35, 4);
        ctx.clip();
        for(let i = 0; i < 8; i++){
            ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#fff';
            ctx.fillRect(-r * .5 + i * (r * .125), -r * .5, r * .125, r * .35);
        }
        ctx.restore();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-r * .5, -r * .5, r, r * .35, 4);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.roundRect(-r * .5, -r * .5, r, r * .06, 4);
        ctx.fill();
        ctx.restore();
    } else if (type === 'fuel') {
        ctx.save();
        ctx.translate(x, y);
        const bg = ctx.createLinearGradient(-r, 0, r, 0);
        bg.addColorStop(0, '#065f46');
        bg.addColorStop(.4, '#34d399');
        bg.addColorStop(1, '#064e3b');
        ctx.fillStyle = bg;
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(-r * .55, -r * .7, r * 1.1, r * 1.4, r * .2);
        ctx.fill();
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.roundRect(-r * .2, -r * .85, r * .4, r * .25, r * .1);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.roundRect(-r * .38, -r * .4, r * .76, r * .7, r * .1);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${r * .55}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⛽', 0, r * .02);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.roundRect(-r * .42, -r * .65, r * .22, r * .5, r * .08);
        ctx.fill();
        ctx.restore();
    } else {
        // traffic light
        ctx.save();
        ctx.translate(x, y);
        const h = r * 3.2;
        ctx.fillStyle = '#374151';
        ctx.fillRect(-r * .12, -h * .5, r * .24, h);
        const hg = ctx.createLinearGradient(-r * .55, 0, r * .55, 0);
        hg.addColorStop(0, '#1f2937');
        hg.addColorStop(.4, '#374151');
        hg.addColorStop(1, '#111827');
        ctx.fillStyle = hg;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-r * .55, -h * .5, r * 1.1, h, r * .3);
        ctx.fill();
        [
            [
                0,
                -r * 1.1,
                '#ef4444',
                '#fca5a5'
            ],
            [
                0,
                0,
                '#f59e0b',
                '#fde68a'
            ],
            [
                0,
                r * 1.1,
                '#22c55e',
                '#86efac'
            ]
        ].forEach(([lx, ly, c, gc])=>{
            const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * .35);
            lg.addColorStop(0, gc);
            lg.addColorStop(.5, c);
            lg.addColorStop(1, c + '88');
            ctx.fillStyle = lg;
            ctx.shadowColor = c;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(lx, ly, r * .34, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}
}),
"[project]/src/components/Game.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Game
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/gameData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/audio.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/drawUtils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const CF_COLORS = [
    '#c084fc',
    '#e879f9',
    '#a78bfa',
    '#fde68a',
    '#93c5fd',
    '#f87171',
    '#fff',
    '#7c3aed',
    '#f0abfc'
];
function spawnConfetti(n = 80) {
    for(let i = 0; i < n; i++)setTimeout(()=>{
        const el = document.createElement('div');
        el.className = 'cf';
        const s = 7 + Math.random() * 12, col = CF_COLORS[~~(Math.random() * CF_COLORS.length)];
        el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;border-radius:${Math.random() > .5 ? '50%' : '2px'};left:${Math.random() * 100}vw;top:-20px;width:${s}px;height:${s}px;background:${col};animation:confettiFall ${1.6 + Math.random() * 2}s ${Math.random() * .4}s linear forwards;`;
        document.body.appendChild(el);
        setTimeout(()=>el.remove(), 4500);
    }, i * 11);
}
function makeBgStars() {
    return Array.from({
        length: 160
    }, ()=>({
            x: Math.random() * 1200,
            y: Math.random() * 900,
            r: Math.random() * 1.6 + .3,
            speed: .2 + Math.random() * .8,
            op: .15 + Math.random() * .7
        }));
}
function Game({ customData }) {
    const activeWishes = customData?.wishes ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WISHES"];
    const defaultTheme = customData?.themeColor ?? '#9333ea';
    const childName = customData?.childName ?? 'Kabileshwar';
    const totalStages = activeWishes.length // ← dynamic! works for 1–7 stages
    ;
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [screen, setScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('intro');
    const [wishIdx, setWishIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hStage, setHStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [hStars, setHStars] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hScore, setHScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hLives, setHLives] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(3);
    const [progPct, setProgPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [progCnt, setProgCnt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('0/10');
    const [progLab, setProgLab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Stage 1 — Collect 10 ⭐');
    const [transMsg, setTransMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [transOpen, setTransOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [goScore, setGoScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dotParticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Array.from({
            length: 70
        }, (_, i)=>({
                id: i,
                left: Math.random() * 100,
                dur: 7 + Math.random() * 14,
                delay: Math.random() * 14,
                size: 0.8 + Math.random() * 2.5,
                op: 0.4 + Math.random() * 0.6
            })));
    // Game state (mutable refs for canvas loop)
    const G = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        stage: 1,
        starsN: 10,
        starsC: 0,
        lives: 3,
        totalScore: 0,
        running: false,
        car: {
            x: 200,
            y: 400,
            w: 36,
            h: 60,
            lane: 1,
            targetX: 200
        },
        laneXs: [
            200,
            400,
            600
        ],
        stars: [],
        obstacles: [],
        puffs: [],
        starTimer: 0,
        obsTimer: 0,
        roadScroll: 0,
        speed: 4,
        invincible: 0,
        shakeT: 0,
        stageColor: '#c084fc',
        bgStars: makeBgStars(),
        bgTimer: 0
    });
    const keysRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const lLRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false), lRRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const screenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('intro');
    // keep screenRef in sync
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        screenRef.current = screen;
    }, [
        screen
    ]);
    const doTransition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((msg, cb)=>{
        setTransMsg(msg);
        setTransOpen(true);
        setTimeout(()=>{
            cb();
            setTransOpen(false);
        }, 380);
    }, []);
    const initStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((n)=>{
        const g = G.current;
        g.stage = n;
        g.starsN = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STARS_NEEDED"][n - 1];
        g.starsC = 0;
        g.speed = 3.8 + n * .42;
        g.stars = [];
        g.obstacles = [];
        g.puffs = [];
        g.starTimer = 0;
        g.obsTimer = 0;
        g.roadScroll = 0;
        g.stageColor = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGE_COLORS"][n - 1];
        g.invincible = 0;
        g.shakeT = 0;
        g.running = true;
        setHStage(n);
        setHStars(0);
        setHScore(g.totalScore);
        setHLives(g.lives);
        setProgLab(`Stage ${n} — Collect ${g.starsN} ⭐`);
        setProgCnt(`0/${g.starsN}`);
        setProgPct(0);
        setTimeout(()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            const W = canvas.width, H = canvas.height;
            g.laneXs = [
                W * .22,
                W * .5,
                W * .78
            ];
            g.car.lane = 1;
            g.car.x = g.laneXs[1];
            g.car.targetX = g.laneXs[1];
            g.car.y = H * .74;
        }, 50);
    }, []);
    // GAME LOOP
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        function resize() {
            const r = canvas.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                canvas.width = r.width;
                canvas.height = r.height;
                const g = G.current, W = canvas.width, H = canvas.height;
                if (g.running) {
                    g.laneXs = [
                        W * .22,
                        W * .5,
                        W * .78
                    ];
                    g.car.targetX = g.laneXs[g.car.lane];
                    g.car.y = H * .74;
                }
            }
        }
        window.addEventListener('resize', resize);
        resize();
        function loop(ts) {
            rafRef.current = requestAnimationFrame(loop);
            const g = G.current;
            const W = canvas.width, H = canvas.height;
            if (W === 0 || H === 0) return;
            if (g.running) {
                const dt = Math.min((ts - lastTRef.current) / 16.67, 3);
                lastTRef.current = ts;
                if (g.invincible > 0) g.invincible -= dt;
                if (g.shakeT > 0) g.shakeT -= dt;
                // input
                if (!lLRef.current && keysRef.current['ArrowLeft']) {
                    lLRef.current = true;
                    if (g.car.lane > 0) {
                        g.car.lane--;
                        g.car.targetX = g.laneXs[g.car.lane];
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndRev"])();
                    }
                }
                if (!keysRef.current['ArrowLeft']) lLRef.current = false;
                if (!lRRef.current && keysRef.current['ArrowRight']) {
                    lRRef.current = true;
                    if (g.car.lane < 2) {
                        g.car.lane++;
                        g.car.targetX = g.laneXs[g.car.lane];
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndRev"])();
                    }
                }
                if (!keysRef.current['ArrowRight']) lRRef.current = false;
                g.car.x += (g.car.targetX - g.car.x) * .14 * dt * 3;
                g.laneXs = [
                    W * .22,
                    W * .5,
                    W * .78
                ];
                g.car.targetX = g.laneXs[g.car.lane];
                g.car.y = H * .74;
                g.roadScroll = (g.roadScroll + g.speed * 1.8 * dt) % 70;
                g.bgTimer++;
                g.bgStars.forEach((s)=>{
                    s.y = (s.y + s.speed * dt) % (H + 10);
                    if (s.y > H) s.y = -5;
                });
                // spawn
                g.starTimer += dt;
                if (g.starTimer > Math.max(22, 55 - g.stage * 4)) {
                    g.starTimer = 0;
                    g.stars.push({
                        x: g.laneXs[~~(Math.random() * 3)],
                        y: -35,
                        w: 16 + g.stage,
                        speed: g.speed + 1.1,
                        spin: 0,
                        spinSpeed: .06 + Math.random() * .04
                    });
                }
                g.obsTimer += dt;
                if (g.obsTimer > Math.max(42, 95 - g.stage * 7)) {
                    g.obsTimer = 0;
                    if (Math.random() < .5 + g.stage * .03) {
                        const types = [
                            'rock',
                            'barrier',
                            'fuel',
                            'light'
                        ];
                        g.obstacles.push({
                            x: g.laneXs[~~(Math.random() * 3)],
                            y: -55,
                            r: 18,
                            speed: g.speed + .5,
                            type: types[~~(Math.random() * types.length)]
                        });
                    }
                }
                // update stars
                for(let i = g.stars.length - 1; i >= 0; i--){
                    g.stars[i].y += g.stars[i].speed * dt;
                    g.stars[i].spin += g.stars[i].spinSpeed * dt;
                    if (g.stars[i].y > H + 50) {
                        g.stars.splice(i, 1);
                        continue;
                    }
                    const s = g.stars[i];
                    if (Math.abs(g.car.x - s.x) < g.car.w * .75 + s.w - 10 && Math.abs(g.car.y - s.y) < g.car.h * .5 + s.w - 10) {
                        g.stars.splice(i, 1);
                        g.starsC++;
                        g.totalScore++;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndCollect"])();
                        const pct = Math.min(100, g.starsC / g.starsN * 100);
                        setHStars(g.starsC);
                        setHScore(g.totalScore);
                        setProgPct(pct);
                        setProgCnt(`${g.starsC}/${g.starsN}`);
                        if (g.starsC >= g.starsN) {
                            g.running = false;
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndWin"])();
                            spawnConfetti(60);
                            setTimeout(()=>{
                                setWishIdx(g.stage - 1);
                                setScreen('wish');
                            }, 500);
                            return;
                        }
                    }
                }
                // update obstacles
                for(let i = g.obstacles.length - 1; i >= 0; i--){
                    g.obstacles[i].y += g.obstacles[i].speed * dt;
                    if (g.obstacles[i].y > H + 60) {
                        g.obstacles.splice(i, 1);
                        continue;
                    }
                    const o = g.obstacles[i];
                    if (g.invincible <= 0 && Math.abs(g.car.x - o.x) < g.car.w * .75 + o.r - 12 && Math.abs(g.car.y - o.y) < g.car.h * .5 + o.r - 12) {
                        g.obstacles.splice(i, 1);
                        g.lives--;
                        g.invincible = 90;
                        g.shakeT = 25;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndCrash"])();
                        spawnConfetti(16);
                        setHLives(g.lives);
                        if (g.lives <= 0) {
                            g.running = false;
                            setGoScore(g.totalScore);
                            setTimeout(()=>doTransition('OH NO! 💥', ()=>setScreen('gameover')), 500);
                            return;
                        }
                    }
                }
            }
            // DRAW
            const shake = g.shakeT > 0;
            if (shake) {
                ctx.save();
                ctx.translate(~~(Math.random() * 8 - 4), ~~(Math.random() * 6 - 3));
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawSpaceBg"])(ctx, W, H, g.bgStars, g.stageColor, g.bgTimer);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawRoad"])(ctx, W, H, g.roadScroll, g.stageColor, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGE_NAMES"][g.stage - 1]);
            // puffs
            g.puffs = g.puffs.filter((p)=>{
                p.y -= 1.4;
                p.r += .45;
                p.op -= .045;
                if (p.op <= 0) return false;
                const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                const a = Math.round(p.op * 180).toString(16).padStart(2, '0');
                pg.addColorStop(0, g.stageColor + a);
                pg.addColorStop(1, 'transparent');
                ctx.fillStyle = pg;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                return true;
            });
            g.stars.forEach((s)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawStar3D"])(ctx, s.x, s.y, s.w * .5, s.spin));
            g.obstacles.forEach((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawObstacle"])(ctx, o.x, o.y, o.r, o.type));
            if (!(g.invincible > 0 && ~~(g.invincible / 5) % 2 === 1)) {
                if (Math.random() < .28) g.puffs.push({
                    x: g.car.x + (Math.random() * g.car.w * .3 - g.car.w * .15),
                    y: g.car.y + g.car.h * .5,
                    r: 2 + Math.random() * 4,
                    op: .5
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawToycar"])(ctx, g.car.x, g.car.y, g.car.w, g.car.h, g.stageColor);
            }
            if (shake) ctx.restore();
        }
        rafRef.current = requestAnimationFrame(loop);
        return ()=>{
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [
        doTransition
    ]);
    // Keyboard
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const kd = (e)=>{
            keysRef.current[e.key] = true;
            if (e.key.startsWith('Arrow')) e.preventDefault();
        };
        const ku = (e)=>{
            keysRef.current[e.key] = false;
        };
        window.addEventListener('keydown', kd);
        window.addEventListener('keyup', ku);
        return ()=>{
            window.removeEventListener('keydown', kd);
            window.removeEventListener('keyup', ku);
        };
    }, []);
    // Intro confetti
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setTimeout(()=>spawnConfetti(30), 600);
    }, []);
    const startGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndRev"])();
        G.current.lives = 3;
        G.current.totalScore = 0;
        doTransition('STAGE 1 🏁', ()=>{
            setScreen('game');
            initStage(1);
        });
    }, [
        doTransition,
        initStage
    ]);
    const continueFromWish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const stage = G.current.stage;
        if (stage >= totalStages) {
            doTransition('🏆 CHAMPION!', ()=>{
                setScreen('winner');
                spawnConfetti(140);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndBday"])();
            });
        } else {
            const ns = stage + 1;
            doTransition(`STAGE ${ns} ⚡`, ()=>{
                setScreen('game');
                initStage(ns);
            });
        }
    }, [
        doTransition,
        initStage,
        totalStages
    ]);
    const retry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$audio$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sndRev"])();
        G.current.lives = 3;
        doTransition('TRY AGAIN! 🔄', ()=>{
            setScreen('game');
            initStage(G.current.stage || 1);
        });
    }, [
        doTransition,
        initStage
    ]);
    const playAgain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        G.current.lives = 3;
        G.current.totalScore = 0;
        doTransition('NEW RACE! 🏁', ()=>setScreen('intro'));
    }, [
        doTransition
    ]);
    const SHORT_WISHES = activeWishes.map((w)=>w.text);
    const wish = activeWishes[wishIdx];
    const isTouch = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && 'ontouchstart' in window;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            background: '#080010',
            fontFamily: "'Nunito',sans-serif"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 500,
                    pointerEvents: 'none',
                    background: 'linear-gradient(135deg,#6b21a8,#9333ea)',
                    clipPath: transOpen ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
                    transition: 'clip-path 0.4s cubic-bezier(.7,0,.3,1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Racing Sans One',cursive",
                    fontSize: 'clamp(1.8rem,6vw,3.5rem)',
                    color: '#fff',
                    letterSpacing: 3,
                    textShadow: '0 0 20px rgba(255,255,255,.5)'
                },
                children: transMsg
            }, void 0, false, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            screen === 'intro' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 40%,#1e0042 0%,#080010 75%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    overflow: 'hidden'
                },
                children: [
                    dotParticles.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'absolute',
                                borderRadius: '50%',
                                width: d.size,
                                height: d.size,
                                left: `${d.left}%`,
                                background: `rgba(147,51,234,${d.op})`,
                                animation: `floatDot ${d.dur}s ${-d.delay}s linear infinite`,
                                pointerEvents: 'none'
                            }
                        }, d.id, false, {
                            fileName: "[project]/src/components/Game.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 'clamp(3rem,12vw,7rem)',
                            filter: 'drop-shadow(0 0 30px #9333ea)',
                            animation: 'flagWave 1.2s ease-in-out infinite alternate',
                            zIndex: 2
                        },
                        children: "🏁"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(2.2rem,8vw,5.5rem)',
                            color: '#d8b4fe',
                            textAlign: 'center',
                            textShadow: '0 0 40px #9333ea,0 0 80px #6b21a8,4px 4px 0 #3b0764',
                            lineHeight: 1.1,
                            padding: '0 16px',
                            zIndex: 2
                        },
                        children: [
                            "⚡ Lightning",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 279,
                                columnNumber: 12
                            }, this),
                            childName,
                            "!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Boogaloo',cursive",
                            fontSize: 'clamp(1rem,3vw,1.6rem)',
                            color: 'rgba(255,255,255,0.75)',
                            zIndex: 2
                        },
                        children: "🎂 Happy 6th Birthday! 🎂"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 281,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'rgba(147,51,234,0.1)',
                            border: '2px solid rgba(147,51,234,0.4)',
                            borderRadius: 20,
                            padding: '16px 26px',
                            maxWidth: 400,
                            margin: '0 16px',
                            zIndex: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 'clamp(0.85rem,2.5vw,1.05rem)',
                                color: 'rgba(255,255,255,0.85)',
                                lineHeight: 1.8,
                                textAlign: 'center',
                                fontFamily: "'Boogaloo',cursive"
                            },
                            children: [
                                "🚗 Steer your car & ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: '#d8b4fe'
                                    },
                                    children: "collect ⭐ stars!"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 284,
                                    columnNumber: 39
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 284,
                                    columnNumber: 98
                                }, this),
                                "Avoid obstacles on the road.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 285,
                                    columnNumber: 43
                                }, this),
                                "Win a stage → unlock a ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: '#d8b4fe'
                                    },
                                    children: "family wish! 💜"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 286,
                                    columnNumber: 38
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 286,
                                    columnNumber: 96
                                }, this),
                                totalStages,
                                " stages · ",
                                totalStages,
                                " wishes · 1 Champion!"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Game.tsx",
                            lineNumber: 283,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: startGame,
                        style: {
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(1.1rem,3.5vw,1.8rem)',
                            background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 60,
                            padding: '16px 44px',
                            cursor: 'pointer',
                            letterSpacing: 2,
                            boxShadow: '0 7px 0 #3b0764,0 0 40px rgba(147,51,234,0.5)',
                            animation: 'btnPulse 1.8s ease-in-out infinite',
                            zIndex: 2
                        },
                        children: "🚦 START RACING!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 272,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    flexDirection: 'column',
                    display: screen === 'game' ? 'flex' : 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '100%',
                            height: 50,
                            background: 'rgba(8,0,16,0.95)',
                            borderBottom: '2px solid rgba(147,51,234,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 12px',
                            gap: 6,
                            flexShrink: 0,
                            zIndex: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '0.58rem',
                                            letterSpacing: 2,
                                            color: 'rgba(255,255,255,0.38)',
                                            textTransform: 'uppercase'
                                        },
                                        children: "Stage"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: '1.2rem',
                                            color: '#d8b4fe'
                                        },
                                        children: [
                                            hStage,
                                            "/",
                                            totalStages
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3
                                },
                                children: Array.from({
                                    length: totalStages
                                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 3
                                        },
                                        children: [
                                            i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 8,
                                                    height: 3,
                                                    background: i < hStage ? '#7c3aed' : '#1e0042',
                                                    borderRadius: 2
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 308,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    background: i + 1 < hStage ? '#7c3aed' : i + 1 === hStage ? '#d8b4fe' : '#1e0042',
                                                    border: `2px solid ${i + 1 < hStage ? '#a78bfa' : i + 1 === hStage ? '#fff' : '#4c1d95'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.55rem',
                                                    animation: i + 1 === hStage ? 'nodePulse 1s ease-in-out infinite' : undefined
                                                },
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$gameData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGE_ICONS"][i] ?? '⭐'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '0.58rem',
                                            letterSpacing: 2,
                                            color: 'rgba(255,255,255,0.38)',
                                            textTransform: 'uppercase'
                                        },
                                        children: "Stars"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 316,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: '1.2rem',
                                            color: '#d8b4fe'
                                        },
                                        children: hStars
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 317,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 315,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '0.58rem',
                                            letterSpacing: 2,
                                            color: 'rgba(255,255,255,0.38)',
                                            textTransform: 'uppercase'
                                        },
                                        children: "Score"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: '1.2rem',
                                            color: '#d8b4fe'
                                        },
                                        children: hScore
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '0.58rem',
                                            letterSpacing: 2,
                                            color: 'rgba(255,255,255,0.38)',
                                            textTransform: 'uppercase'
                                        },
                                        children: "Lives"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: '1.2rem',
                                            color: '#d8b4fe'
                                        },
                                        children: '❤️'.repeat(Math.max(0, hLives))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        style: {
                            flex: 1,
                            width: '100%',
                            display: 'block',
                            touchAction: 'none'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '100%',
                            height: 44,
                            background: 'rgba(8,0,16,0.95)',
                            borderTop: '2px solid rgba(147,51,234,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 14px',
                            gap: 10,
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "'Boogaloo',cursive",
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    whiteSpace: 'nowrap'
                                },
                                children: progLab
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    height: 12,
                                    background: '#120024',
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    border: '2px solid #3b0764'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: '100%',
                                        width: `${progPct}%`,
                                        background: 'linear-gradient(90deg,#7c3aed,#d8b4fe)',
                                        borderRadius: 6,
                                        transition: 'width 0.25s'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "'Boogaloo',cursive",
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    whiteSpace: 'nowrap'
                                },
                                children: progCnt
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            bottom: 48,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            zIndex: 20,
                            pointerEvents: 'none'
                        },
                        children: [
                            {
                                label: '◀',
                                key: 'ArrowLeft'
                            },
                            {
                                label: '▶',
                                key: 'ArrowRight'
                            }
                        ].map(({ label, key })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onTouchStart: (e)=>{
                                    e.preventDefault();
                                    keysRef.current[key] = true;
                                },
                                onTouchEnd: (e)=>{
                                    e.preventDefault();
                                    keysRef.current[key] = false;
                                },
                                style: {
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: 'rgba(147,51,234,0.2)',
                                    border: '3px solid rgba(147,51,234,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    pointerEvents: 'all',
                                    userSelect: 'none',
                                    cursor: 'pointer'
                                },
                                children: label
                            }, key, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 343,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this),
            screen === 'wish' && wish && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 300,
                    background: 'rgba(5,0,12,0.97)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backdropFilter: 'blur(14px)',
                    overflow: 'hidden'
                },
                children: [
                    Array.from({
                        length: 10
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'absolute',
                                left: `${5 + i * 10}%`,
                                top: `${10 + i * 37 % 70}%`,
                                animation: `floatSparkle ${1.5 + i * .3}s ${i * .2}s ease-in-out infinite`,
                                pointerEvents: 'none',
                                fontSize: i % 2 === 0 ? '1.2rem' : '0.85rem'
                            },
                            children: [
                                '✨',
                                '⭐',
                                '💫',
                                '🌟',
                                '💜'
                            ][i % 5]
                        }, i, false, {
                            fileName: "[project]/src/components/Game.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            animation: 'giftSlideUp 0.6s cubic-bezier(.36,1.3,.5,1) both',
                            width: 'min(420px,92vw)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: -32,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '3rem',
                                    zIndex: 10,
                                    animation: 'bowFlyUp 0.7s 0.75s cubic-bezier(.36,1.3,.5,1) both',
                                    filter: 'drop-shadow(0 0 12px rgba(255,100,200,0.9))'
                                },
                                children: "🎀"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '18%',
                                    left: 0,
                                    right: 0,
                                    height: 20,
                                    zIndex: 9,
                                    display: 'flex',
                                    overflow: 'hidden',
                                    borderRadius: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            background: `linear-gradient(90deg,transparent,${wish.color}cc,${wish.color})`,
                                            animation: 'ribbonLeft 0.55s 0.6s ease-in forwards',
                                            transformOrigin: 'right center'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            background: `linear-gradient(90deg,${wish.color},${wish.color}cc,transparent)`,
                                            animation: 'ribbonRight 0.55s 0.6s ease-in forwards',
                                            transformOrigin: 'left center'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    animation: 'lidLift 0.65s 1.05s cubic-bezier(.36,1.3,.5,1) both',
                                    transformOrigin: 'center bottom',
                                    zIndex: 8,
                                    width: '100%'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: `linear-gradient(135deg,${wish.color}ee,${wish.color}88)`,
                                        borderRadius: '20px 20px 4px 4px',
                                        height: 56,
                                        border: `3px solid ${wish.color}`,
                                        boxShadow: `0 -6px 24px ${wish.color}66`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '1rem',
                                            color: '#fff',
                                            letterSpacing: 2,
                                            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                                        },
                                        children: wish.tag
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Game.tsx",
                                    lineNumber: 387,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'linear-gradient(160deg,#140028,#1e0038,#0e001e)',
                                    border: `3px solid ${wish.color}`,
                                    borderTop: 'none',
                                    borderRadius: '4px 4px 24px 24px',
                                    padding: '16px 24px 28px',
                                    boxShadow: `0 0 0 4px ${wish.color}22,0 20px 60px rgba(0,0,0,0.9),0 0 80px ${wish.color}33`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    width: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 20,
                                            height: '100%',
                                            background: `linear-gradient(180deg,${wish.color}88,${wish.color}33)`,
                                            pointerEvents: 'none'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: '35%',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                            animation: 'sparkleBurst 0.65s 1.35s ease-out both',
                                            pointerEvents: 'none',
                                            zIndex: 5,
                                            fontSize: '3.5rem'
                                        },
                                        children: "✨"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 401,
                                        columnNumber: 15
                                    }, this),
                                    [
                                        {
                                            sx: '-90px',
                                            sy: '-80px',
                                            e: '⭐'
                                        },
                                        {
                                            sx: '90px',
                                            sy: '-80px',
                                            e: '💫'
                                        },
                                        {
                                            sx: '-110px',
                                            sy: '10px',
                                            e: '✨'
                                        },
                                        {
                                            sx: '110px',
                                            sy: '10px',
                                            e: '🌟'
                                        },
                                        {
                                            sx: '-65px',
                                            sy: '85px',
                                            e: '💜'
                                        },
                                        {
                                            sx: '65px',
                                            sy: '85px',
                                            e: '⭐'
                                        }
                                    ].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                top: '35%',
                                                left: '50%',
                                                transform: 'translate(-50%,-50%)',
                                                ['--sx']: p.sx,
                                                ['--sy']: p.sy,
                                                animation: `sparkleOut 0.7s ${1.35 + i * .06}s ease-out both`,
                                                pointerEvents: 'none',
                                                zIndex: 5,
                                                fontSize: '1.1rem'
                                            },
                                            children: p.e
                                        }, i, false, {
                                            fileName: "[project]/src/components/Game.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            animation: 'photoReveal 0.7s 1.55s cubic-bezier(.36,1.3,.5,1) both',
                                            margin: '18px auto 14px',
                                            width: 'clamp(110px,28vw,150px)',
                                            aspectRatio: '1',
                                            position: 'relative',
                                            zIndex: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    inset: -6,
                                                    borderRadius: '50%',
                                                    background: `conic-gradient(${wish.color},#fff4,${wish.color},#fff4,${wish.color})`,
                                                    animation: 'flagWave 3s linear infinite',
                                                    opacity: 0.5
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 419,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'relative',
                                                    zIndex: 2,
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: `4px solid ${wish.color}`,
                                                    boxShadow: `0 0 0 3px #fff2,0 0 30px ${wish.color}99`,
                                                    background: `linear-gradient(135deg,${wish.color}33,#1a0030)`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    animation: 'photoFloat 3s 2.3s ease-in-out infinite'
                                                },
                                                children: wish.photo ? /* ── REPLACE BELOW with <img src={`/photo${wish.photo}.jpg`} ... /> once you add real photos to /public ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: wish.photo,
                                                    style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '50%'
                                                    },
                                                    alt: "Family photo"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Game.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '3.5rem'
                                                    },
                                                    children: wish.av
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Game.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 421,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 417,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            animation: 'badgePop 0.5s 1.95s cubic-bezier(.36,1.5,.5,1) both',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            margin: '0 auto 14px',
                                            background: `${wish.color}22`,
                                            border: `2px solid ${wish.color}66`,
                                            borderRadius: 40,
                                            padding: '6px 18px',
                                            width: 'fit-content',
                                            position: 'relative',
                                            zIndex: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '1.5rem'
                                                },
                                                children: wish.av
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 433,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: "'Racing Sans One',cursive",
                                                    fontSize: 'clamp(0.85rem,3vw,1.05rem)',
                                                    color: wish.color
                                                },
                                                children: [
                                                    "From ",
                                                    wish.from
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Game.tsx",
                                                lineNumber: 434,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            animation: 'wishTextIn 0.5s 2.25s ease-out both',
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: 'clamp(1.15rem,4vw,1.55rem)',
                                            color: '#fff',
                                            textAlign: 'center',
                                            lineHeight: 1.55,
                                            padding: '0 8px',
                                            position: 'relative',
                                            zIndex: 6,
                                            textShadow: `0 0 20px ${wish.color}88`
                                        },
                                        children: SHORT_WISHES[wishIdx]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: continueFromWish,
                                        style: {
                                            animation: 'btnFadeUp 0.5s 2.65s ease-out both',
                                            marginTop: 20,
                                            display: 'block',
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '1rem',
                                            background: `linear-gradient(135deg,${wish.color},#6b21a8)`,
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 40,
                                            padding: '13px 36px',
                                            cursor: 'pointer',
                                            boxShadow: `0 6px 0 #3b0764,0 0 24px ${wish.color}55`,
                                            letterSpacing: 1,
                                            width: '100%',
                                            position: 'relative',
                                            zIndex: 6
                                        },
                                        children: G.current.stage >= totalStages ? '🏆 CLAIM THE TROPHY!' : 'NEXT STAGE ⚡'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this),
            screen === 'gameover' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 40%,#1a0010,#080010)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '4rem'
                        },
                        children: "💥"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 456,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(2rem,7vw,3.5rem)',
                            color: '#f87171',
                            textShadow: '0 0 30px rgba(248,113,113,.7)',
                            textAlign: 'center'
                        },
                        children: "OH NO! CRASH!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 457,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: "'Boogaloo',cursive",
                            fontSize: 'clamp(1rem,3vw,1.3rem)',
                            color: 'rgba(255,255,255,.8)',
                            textAlign: 'center',
                            padding: '0 20px'
                        },
                        children: [
                            "Don't worry ",
                            childName,
                            "!",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 458,
                                columnNumber: 179
                            }, this),
                            "Every champion crashes sometimes!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 458,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Boogaloo',cursive",
                            fontSize: '1.4rem',
                            color: '#d8b4fe'
                        },
                        children: [
                            "⭐ Stars: ",
                            goScore
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 459,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: retry,
                        style: {
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(1.1rem,3.5vw,1.8rem)',
                            background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 60,
                            padding: '16px 44px',
                            cursor: 'pointer',
                            letterSpacing: 2,
                            boxShadow: '0 7px 0 #3b0764'
                        },
                        children: "🔄 TRY AGAIN!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 460,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 455,
                columnNumber: 9
            }, this),
            screen === 'winner' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%,#1e0042,#080010)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: 20,
                    overflowY: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(1.6rem,5.5vw,3.5rem)',
                            color: '#d8b4fe',
                            textAlign: 'center',
                            textShadow: '0 0 40px rgba(147,51,234,.8)',
                            lineHeight: 1.1
                        },
                        children: [
                            "⚡ LIGHTNING ",
                            childName.toUpperCase(),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 469,
                                columnNumber: 232
                            }, this),
                            "IS THE CHAMPION! 🏆"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "anim-trophy",
                        style: {
                            fontSize: '2.2rem'
                        },
                        children: "🏆🥇🎊⭐🚗⚡🎂"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 470,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "anim-winfloat",
                        style: {
                            width: 'clamp(90px,20vw,130px)',
                            aspectRatio: '1',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '5px solid #9333ea',
                            boxShadow: '0 0 0 4px #6b21a8,0 0 50px rgba(147,51,234,.7)',
                            background: '#180030',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            color: 'rgba(255,255,255,.35)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '2rem'
                                },
                                children: "📸"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 472,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                style: {
                                    fontSize: '.6rem',
                                    letterSpacing: 1,
                                    textTransform: 'uppercase'
                                },
                                children: "Winner!"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 472,
                                columnNumber: 54
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 471,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontFamily: "'Boogaloo',cursive",
                            fontSize: '1rem',
                            color: 'rgba(255,255,255,.65)',
                            textAlign: 'center',
                            maxWidth: 480,
                            padding: '0 16px'
                        },
                        children: "You collected all 7 wishes from your whole family! 💜"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 474,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))',
                            gap: 8,
                            width: '100%',
                            maxWidth: 660
                        },
                        children: activeWishes.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'rgba(147,51,234,.08)',
                                    border: `2px solid ${w.color}44`,
                                    borderRadius: 14,
                                    padding: '10px 12px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '1.5rem'
                                        },
                                        children: w.av
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 480,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'Racing Sans One',cursive",
                                            fontSize: '.75rem',
                                            color: '#d8b4fe',
                                            margin: '3px 0',
                                            letterSpacing: 1
                                        },
                                        children: w.from
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 481,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: "'Boogaloo',cursive",
                                            fontSize: '.82rem',
                                            color: 'rgba(255,255,255,.8)',
                                            lineHeight: 1.5
                                        },
                                        children: w.text
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Game.tsx",
                                        lineNumber: 482,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/Game.tsx",
                                lineNumber: 479,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 477,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: playAgain,
                        style: {
                            marginTop: 8,
                            fontFamily: "'Racing Sans One',cursive",
                            fontSize: 'clamp(1.1rem,3.5vw,1.8rem)',
                            background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 60,
                            padding: '16px 44px',
                            cursor: 'pointer',
                            letterSpacing: 2,
                            boxShadow: '0 7px 0 #3b0764'
                        },
                        children: "🏁 RACE AGAIN!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Game.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 468,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Game.tsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/play/[slug]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlayPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gameService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gameService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Game$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Game.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function PlayPage({ params }) {
    const { slug } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use(params);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [notFound, setNotFound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [gameData, setGameData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchGame() {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gameService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadGame"])(slug);
            if (!result) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            const { game, wishes } = result;
            // Map DB wishes to game Wish format
            const mappedWishes = wishes.map((w, i)=>({
                    from: w.from_name,
                    av: w.avatar,
                    color: [
                        '#c084fc',
                        '#fde68a',
                        '#e879f9',
                        '#6ee7b7',
                        '#93c5fd',
                        '#fca5a5',
                        '#fde68a'
                    ][i % 7],
                    tag: i < 6 ? `Stage ${w.stage} Complete! 🏁` : '🏁 CHAMPION! All Done!',
                    photo: w.photo_url || null,
                    text: w.short_wish
                }));
            setGameData({
                childName: game.child_name,
                themeColor: game.theme_color,
                wishes: mappedWishes
            });
            setLoading(false);
        }
        fetchGame();
    }, [
        slug
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: '#080010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '4rem',
                    animation: 'spin 1s linear infinite'
                },
                children: "🚗"
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontFamily: "'Racing Sans One',cursive",
                    color: '#d8b4fe',
                    fontSize: '1.5rem',
                    letterSpacing: 2
                },
                children: "Loading game..."
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/play/[slug]/page.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
    if (notFound) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: '#080010',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
            padding: 24,
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '4rem'
                },
                children: "😢"
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontFamily: "'Racing Sans One',cursive",
                    color: '#f87171',
                    fontSize: '2rem'
                },
                children: "Game not found!"
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontFamily: "'Boogaloo',cursive",
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.2rem'
                },
                children: "This birthday game link may have expired or the URL is wrong."
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/create",
                style: {
                    fontFamily: "'Racing Sans One',cursive",
                    background: 'linear-gradient(135deg,#9333ea,#6b21a8)',
                    color: '#fff',
                    borderRadius: 40,
                    padding: '13px 28px',
                    textDecoration: 'none',
                    letterSpacing: 1
                },
                children: "🎁 Create a New Game"
            }, void 0, false, {
                fileName: "[project]/src/app/play/[slug]/page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/play/[slug]/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Game$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        customData: gameData
    }, void 0, false, {
        fileName: "[project]/src/app/play/[slug]/page.tsx",
        lineNumber: 61,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__523af373._.js.map