module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AVATARS",
    ()=>AVATARS,
    "THEME_COLORS",
    ()=>THEME_COLORS
]);
const AVATARS = [
    '👵',
    '👩',
    '👨',
    '👦',
    '👧',
    '👶',
    '🏠',
    '❤️',
    '🌟',
    '🎉',
    '🦁',
    '🐯'
];
const THEME_COLORS = [
    {
        label: 'Purple',
        value: '#9333ea'
    },
    {
        label: 'Pink',
        value: '#ec4899'
    },
    {
        label: 'Blue',
        value: '#3b82f6'
    },
    {
        label: 'Green',
        value: '#22c55e'
    },
    {
        label: 'Orange',
        value: '#f97316'
    },
    {
        label: 'Red',
        value: '#ef4444'
    },
    {
        label: 'Gold',
        value: '#f59e0b'
    },
    {
        label: 'Teal',
        value: '#14b8a6'
    }
];
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
"[project]/src/app/create/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreatePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gameService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gameService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const STAGE_LABELS = [
    'Family Member 1',
    'Family Member 2',
    'Family Member 3',
    'Family Member 4',
    'Family Member 5',
    'Family Member 6',
    'Grand Finale 🏆'
];
const defaultWishes = ()=>Array.from({
        length: 7
    }, (_, i)=>({
            stage: i + 1,
            from_name: '',
            avatar: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATARS"][i] || '🎁',
            short_wish: ''
        }));
function CreatePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        child_name: '',
        age: 5,
        theme_color: '#9333ea',
        wishes: defaultWishes()
    });
    const col = state.theme_color;
    function updateWish(idx, field, value) {
        const updated = [
            ...state.wishes
        ];
        updated[idx] = {
            ...updated[idx],
            [field]: value
        };
        setState((s)=>({
                ...s,
                wishes: updated
            }));
    }
    function handlePhoto(idx, file) {
        const preview = URL.createObjectURL(file);
        const updated = [
            ...state.wishes
        ];
        updated[idx] = {
            ...updated[idx],
            photo_file: file,
            photo_preview: preview
        };
        setState((s)=>({
                ...s,
                wishes: updated
            }));
    }
    async function handlePublish() {
        setLoading(true);
        setError('');
        const filled = state.wishes.filter((w)=>w.from_name.trim() && w.short_wish.trim());
        if (filled.length < 1) {
            setError('Please add at least 1 family member wish!');
            setLoading(false);
            return;
        }
        const finalState = {
            ...state,
            wishes: filled
        };
        const slug = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gameService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveGame"])(finalState);
        if (!slug) {
            setError('Something went wrong. Please try again!');
            setLoading(false);
            return;
        }
        router.push(`/success?slug=${slug}&name=${encodeURIComponent(state.child_name)}`);
    }
    const inputStyle = {
        width: '100%',
        background: '#1a0030',
        border: `2px solid ${col}44`,
        borderRadius: 12,
        padding: '12px 16px',
        color: '#fff',
        fontFamily: "'Boogaloo',cursive",
        fontSize: '1.1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };
    const labelStyle = {
        fontFamily: "'Racing Sans One',cursive",
        fontSize: '0.8rem',
        letterSpacing: 2,
        color: `${col}cc`,
        textTransform: 'uppercase',
        marginBottom: 6,
        display: 'block'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at 50% 0%,#1e0042,#080010)',
            padding: '24px 16px',
            overflowY: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 560,
                margin: '0 auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        marginBottom: 32
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '3rem',
                                marginBottom: 8
                            },
                            children: "🎁"
                        }, void 0, false, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: {
                                fontFamily: "'Racing Sans One',cursive",
                                fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                                color: col,
                                textShadow: `0 0 30px ${col}88`,
                                marginBottom: 8
                            },
                            children: "Create a Birthday Game"
                        }, void 0, false, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontFamily: "'Boogaloo',cursive",
                                fontSize: '1.1rem',
                                color: 'rgba(255,255,255,0.6)'
                            },
                            children: "Make a personalised race game for your child! 🚗⚡"
                        }, void 0, false, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/create/page.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 32
                    },
                    children: [
                        'Child Info',
                        'Wishes',
                        'Photos',
                        'Preview'
                    ].map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            },
                            children: [
                                i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 24,
                                        height: 2,
                                        background: step > i ? col : '#2a0050',
                                        borderRadius: 2
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 87,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: step === i + 1 ? col : step > i + 1 ? col + '88' : '#1a0030',
                                        border: `2px solid ${step >= i + 1 ? col : '#2a0050'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: "'Boogaloo',cursive",
                                        fontSize: '0.9rem',
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    },
                                    children: step > i + 1 ? '✓' : i + 1
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/create/page.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'linear-gradient(145deg,#120024,#1a0036)',
                        border: `2px solid ${col}44`,
                        borderRadius: 24,
                        padding: '28px 24px',
                        boxShadow: `0 0 60px ${col}22`
                    },
                    children: [
                        step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1.4rem',
                                        color: '#fff',
                                        marginBottom: 4
                                    },
                                    children: "🧒 About the Birthday Child"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: labelStyle,
                                            children: "Child's Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            style: inputStyle,
                                            placeholder: "e.g. Kabileshwar",
                                            value: state.child_name,
                                            onChange: (e)=>setState((s)=>({
                                                        ...s,
                                                        child_name: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: labelStyle,
                                            children: "Age they're turning"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 10,
                                                flexWrap: 'wrap'
                                            },
                                            children: [
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                                6,
                                                7,
                                                8,
                                                9,
                                                10
                                            ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setState((s)=>({
                                                                ...s,
                                                                age: n
                                                            })),
                                                    style: {
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 12,
                                                        border: `2px solid ${state.age === n ? col : '#2a0050'}`,
                                                        background: state.age === n ? col : '#1a0030',
                                                        color: '#fff',
                                                        fontFamily: "'Boogaloo',cursive",
                                                        fontSize: '1.2rem',
                                                        cursor: 'pointer'
                                                    },
                                                    children: n
                                                }, n, false, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: labelStyle,
                                            children: "Theme Colour"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 10,
                                                flexWrap: 'wrap'
                                            },
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["THEME_COLORS"].map((tc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setState((s)=>({
                                                                ...s,
                                                                theme_color: tc.value
                                                            })),
                                                    title: tc.label,
                                                    style: {
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        background: tc.value,
                                                        border: `3px solid ${state.theme_color === tc.value ? '#fff' : 'transparent'}`,
                                                        cursor: 'pointer',
                                                        boxShadow: state.theme_color === tc.value ? `0 0 12px ${tc.value}` : 'none'
                                                    }
                                                }, tc.value, false, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 24
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1.4rem',
                                        color: '#fff',
                                        marginBottom: 4
                                    },
                                    children: "💜 Family Wishes"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontFamily: "'Boogaloo',cursive",
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '1rem',
                                        marginTop: -16
                                    },
                                    children: "Add up to 7 family members. Each wish unlocks after a race stage! Fill as many as you like."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this),
                                state.wishes.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#0e001e',
                                            borderRadius: 16,
                                            padding: '16px',
                                            border: `1px solid ${col}33`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: "'Racing Sans One',cursive",
                                                    fontSize: '0.75rem',
                                                    color: col,
                                                    letterSpacing: 2,
                                                    marginBottom: 12
                                                },
                                                children: [
                                                    "STAGE ",
                                                    i + 1,
                                                    " — ",
                                                    STAGE_LABELS[i]
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/create/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: 10,
                                                    marginBottom: 12,
                                                    flexWrap: 'wrap'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        gap: 6,
                                                        flexWrap: 'wrap',
                                                        flex: 1
                                                    },
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATARS"].map((av)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>updateWish(i, 'avatar', av),
                                                            style: {
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 8,
                                                                border: `2px solid ${w.avatar === av ? col : '#2a0050'}`,
                                                                background: w.avatar === av ? col + '44' : '#1a0030',
                                                                fontSize: '1.2rem',
                                                                cursor: 'pointer'
                                                            },
                                                            children: av
                                                        }, av, false, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/create/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 10
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        style: inputStyle,
                                                        placeholder: "Who is this from? (e.g. Paati, Amma, Anna...)",
                                                        value: w.from_name,
                                                        onChange: (e)=>updateWish(i, 'from_name', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/create/page.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        style: inputStyle,
                                                        placeholder: "Short wish — 1 line! (e.g. You are my shining star! ⭐)",
                                                        value: w.short_wish,
                                                        onChange: (e)=>updateWish(i, 'short_wish', e.target.value),
                                                        maxLength: 60
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/create/page.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontFamily: "'Boogaloo',cursive",
                                                            fontSize: '0.8rem',
                                                            color: 'rgba(255,255,255,0.3)',
                                                            textAlign: 'right'
                                                        },
                                                        children: [
                                                            w.short_wish.length,
                                                            "/60"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/create/page.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/create/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/create/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 147,
                            columnNumber: 13
                        }, this),
                        step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1.4rem',
                                        color: '#fff',
                                        marginBottom: 4
                                    },
                                    children: "📸 Add Photos"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontFamily: "'Boogaloo',cursive",
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '1rem',
                                        marginTop: -12
                                    },
                                    children: "Optional! Add a photo for each family member — it reveals inside the gift box! 🎁"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 15
                                }, this),
                                state.wishes.filter((w)=>w.from_name.trim()).map((w, i)=>{
                                    const realIdx = state.wishes.findIndex((x)=>x.stage === w.stage);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 16,
                                            background: '#0e001e',
                                            borderRadius: 16,
                                            padding: 16,
                                            border: `1px solid ${col}33`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: `3px solid ${col}`,
                                                    flexShrink: 0,
                                                    background: '#1a0030',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '2rem'
                                                },
                                                children: w.photo_preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: w.photo_preview,
                                                    style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    },
                                                    alt: "preview"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 27
                                                }, this) : w.avatar
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/create/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontFamily: "'Racing Sans One',cursive",
                                                            fontSize: '0.85rem',
                                                            color: col,
                                                            marginBottom: 8
                                                        },
                                                        children: [
                                                            "Stage ",
                                                            w.stage,
                                                            " — ",
                                                            w.from_name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/create/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'inline-block',
                                                            background: col + '33',
                                                            border: `2px solid ${col}66`,
                                                            borderRadius: 10,
                                                            padding: '8px 16px',
                                                            cursor: 'pointer',
                                                            fontFamily: "'Boogaloo',cursive",
                                                            color: '#fff',
                                                            fontSize: '0.95rem'
                                                        },
                                                        children: [
                                                            w.photo_preview ? '🔄 Change Photo' : '📷 Upload Photo',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "image/*",
                                                                style: {
                                                                    display: 'none'
                                                                },
                                                                onChange: (e)=>{
                                                                    if (e.target.files?.[0]) handlePhoto(realIdx, e.target.files[0]);
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/create/page.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/create/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/create/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/create/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, this),
                        step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1.4rem',
                                        color: '#fff',
                                        marginBottom: 4
                                    },
                                    children: "🎮 Ready to Launch!"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#0e001e',
                                        borderRadius: 16,
                                        padding: 20,
                                        border: `2px solid ${col}55`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                marginBottom: 16
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: '50%',
                                                        background: col,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.8rem'
                                                    },
                                                    children: "🎂"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontFamily: "'Racing Sans One',cursive",
                                                                fontSize: '1.4rem',
                                                                color: col
                                                            },
                                                            children: state.child_name || 'Your Child'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontFamily: "'Boogaloo',cursive",
                                                                color: 'rgba(255,255,255,0.6)',
                                                                fontSize: '1rem'
                                                            },
                                                            children: [
                                                                "Turning ",
                                                                state.age,
                                                                " 🎉"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 8
                                            },
                                            children: state.wishes.filter((w)=>w.from_name.trim()).map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 10,
                                                        padding: '8px 12px',
                                                        background: col + '15',
                                                        borderRadius: 10
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '1.3rem'
                                                            },
                                                            children: w.avatar
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontFamily: "'Boogaloo',cursive",
                                                                color: '#fff',
                                                                fontSize: '0.95rem',
                                                                flex: 1
                                                            },
                                                            children: w.from_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 23
                                                        }, this),
                                                        w.photo_preview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '1rem'
                                                            },
                                                            children: "📸"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 43
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontFamily: "'Boogaloo',cursive",
                                                                color: col,
                                                                fontSize: '0.8rem'
                                                            },
                                                            children: [
                                                                "Stage ",
                                                                w.stage
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/create/page.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/src/app/create/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/create/page.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 15
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#ff000022',
                                        border: '2px solid #ff4444',
                                        borderRadius: 12,
                                        padding: '12px 16px',
                                        fontFamily: "'Boogaloo',cursive",
                                        color: '#ff8888',
                                        fontSize: '1rem'
                                    },
                                    children: [
                                        "⚠️ ",
                                        error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 254,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handlePublish,
                                    disabled: loading,
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1.2rem',
                                        background: loading ? '#3a0070' : `linear-gradient(135deg,${col},#6b21a8)`,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 50,
                                        padding: '16px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: `0 6px 0 #3b0764`,
                                        letterSpacing: 1,
                                        width: '100%'
                                    },
                                    children: loading ? '⏳ Creating your game...' : '🚀 PUBLISH THE GAME!'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 28,
                                gap: 12
                            },
                            children: [
                                step > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setStep((s)=>s - 1),
                                    style: {
                                        fontFamily: "'Boogaloo',cursive",
                                        fontSize: '1rem',
                                        background: 'transparent',
                                        border: `2px solid ${col}55`,
                                        color: col,
                                        borderRadius: 40,
                                        padding: '10px 24px',
                                        cursor: 'pointer'
                                    },
                                    children: "← Back"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 273,
                                    columnNumber: 17
                                }, this),
                                step < 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (step === 1 && !state.child_name.trim()) {
                                            setError('Please enter the child\'s name!');
                                            return;
                                        }
                                        setError('');
                                        setStep((s)=>s + 1);
                                    },
                                    style: {
                                        fontFamily: "'Racing Sans One',cursive",
                                        fontSize: '1rem',
                                        background: `linear-gradient(135deg,${col},#6b21a8)`,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 40,
                                        padding: '12px 32px',
                                        cursor: 'pointer',
                                        boxShadow: `0 4px 0 #3b0764`,
                                        letterSpacing: 1
                                    },
                                    children: "Next →"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/create/page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this),
                        error && step !== 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12,
                                fontFamily: "'Boogaloo',cursive",
                                color: '#ff8888',
                                fontSize: '0.95rem',
                                textAlign: 'center'
                            },
                            children: [
                                "⚠️ ",
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/create/page.tsx",
                            lineNumber: 286,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/create/page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/create/page.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/create/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__210664af._.js.map