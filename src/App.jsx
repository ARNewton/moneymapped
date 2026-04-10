import { useState, useMemo } from 'react';

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
@keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes barGrow { from { width:0; } to { width:var(--w); } }
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#F7F3EC; }
.app  { min-height:100vh; background:#F7F3EC; font-family:'DM Sans',sans-serif; color:#1C1917; }
.screen { animation:fadeUp .4s ease both; }
.wrap { max-width:580px; margin:0 auto; padding:0 24px 100px; }

/* Progress dots */
.prog { display:flex; gap:5px; justify-content:center; padding:26px 0 0; }
.dot  { width:6px; height:6px; border-radius:50%; background:#DDD8CF; transition:all .3s; }
.dot.on  { background:#4E6B3F; width:26px; border-radius:3px; }
.dot.was { background:#9AAB86; }

/* Typography */
.eye  { font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#A39A8E; margin-bottom:12px; }
.h1   { font-family:'Fraunces',serif; font-weight:300; font-size:46px; line-height:1.07; margin-bottom:10px; }
.h2   { font-family:'Fraunces',serif; font-weight:300; font-size:34px; line-height:1.1;  margin-bottom:10px; }
.h1 em, .h2 em { font-style:italic; color:#4E6B3F; }
.sub  { font-size:15px; color:#6B6358; line-height:1.6; font-weight:300; margin-bottom:32px; }
.sect { font-size:10px; letter-spacing:.13em; text-transform:uppercase; color:#A39A8E; margin-bottom:12px; margin-top:22px; }
.line { width:36px; height:2px; background:#4E6B3F; margin-bottom:26px; }
.tag-g { font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#4E6B3F; font-weight:500; margin-bottom:12px; }

/* Generic cards */
.card { background:#FFF; border:1.5px solid #E0DAD0; border-radius:18px; padding:22px 24px; margin-bottom:10px; }

/* Expandable teach cards */
.teach { background:#FFF; border:1.5px solid #E0DAD0; border-radius:18px; padding:24px 26px; margin-bottom:10px; cursor:pointer; transition:all .2s; position:relative; }
.teach:hover { border-color:#9AAB86; }
.teach.open  { border-color:#4E6B3F; background:#F7FAF4; }
.teach .ti   { font-size:26px; margin-bottom:10px; }
.teach .tt   { font-family:'Fraunces',serif; font-size:19px; font-weight:300; color:#1C1917; margin-bottom:4px; }
.teach .ts   { font-size:13px; color:#6B6358; line-height:1.55; }
.teach .tb   { font-size:13px; color:#4A4139; line-height:1.7; margin-top:12px; padding-top:12px; border-top:1px solid #E8E2D8; display:none; }
.teach.open .tb { display:block; }
.teach .ttag { position:absolute; top:16px; right:16px; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:#9AAB86; background:#EFF5EA; padding:3px 9px; border-radius:100px; }

/* Province grid */
.pgrid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; margin-bottom:28px; }
.pbtn  { padding:10px 6px; border:1.5px solid #E0DAD0; border-radius:10px; background:#FFF; cursor:pointer; font-size:12px; color:#4A4139; font-family:'DM Sans',sans-serif; transition:all .2s; text-align:center; }
.pbtn:hover { border-color:#9AAB86; }
.pbtn.sel   { border-color:#4E6B3F; background:#EFF5EA; color:#2D4A1E; font-weight:500; }

/* Sliders */
.sval { font-family:'Fraunces',serif; font-weight:300; font-size:56px; line-height:1; color:#1C1917; margin-bottom:2px; }
.slbl { font-size:12px; color:#A39A8E; margin-bottom:14px; letter-spacing:.04em; }
.rng  { width:100%; height:2px; -webkit-appearance:none; appearance:none; border-radius:2px; outline:none; cursor:pointer; background:linear-gradient(to right, #4E6B3F var(--p,0%), #E0DAD0 var(--p,0%)); margin-bottom:28px; }
.rng::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#4E6B3F; cursor:pointer; box-shadow:0 2px 8px rgba(78,107,63,.3); transition:transform .15s; }
.rng::-webkit-slider-thumb:hover { transform:scale(1.15); }

/* Dark tax panel */
.dark   { background:#1C1917; border-radius:20px; padding:26px; margin:18px 0; }
.d-lbl  { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:#6B6358; margin-bottom:5px; }
.d-val  { font-family:'Fraunces',serif; font-size:40px; font-weight:300; color:#F7F3EC; line-height:1; margin-bottom:3px; }
.d-note { font-size:12px; color:#4A4139; }
.dr     { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #2D2922; }
.dr:last-of-type { border-bottom:none; }
.dr .dl { font-size:13px; color:#8C8278; }
.dr .dv { font-size:13px; color:#B5AFA7; font-weight:500; }
.dr.tot .dl { color:#D4CFC7; font-weight:500; }
.dr.tot .dv { color:#F7F3EC; font-weight:500; }
.eff    { margin-top:12px; padding-top:12px; border-top:1px solid #2D2922; display:flex; justify-content:space-between; }
.eff span:first-child { font-size:12px; color:#6B6358; }
.eff span:last-child  { font-size:12px; color:#9AAB86; font-weight:500; }

/* Account inventory */
.acc-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
.acc-card { padding:15px 14px; border:1.5px solid #E0DAD0; border-radius:13px; background:#FFF; cursor:pointer; transition:all .2s; position:relative; }
.acc-card:hover { border-color:#9AAB86; }
.acc-card.sel   { border-color:#4E6B3F; background:#EFF5EA; }
.acc-card.sel::after { content:'✓'; position:absolute; top:9px; right:11px; font-size:10px; color:#4E6B3F; font-weight:600; }
.acc-card .ai { font-size:17px; margin-bottom:5px; display:block; }
.acc-card .an { font-size:13px; font-weight:500; color:#1C1917; }
.acc-card .ah { font-size:11px; color:#A39A8E; margin-top:1px; }

/* Account detail (where held + balance) */
.acc-detail { background:#FAFAF6; border:1.5px solid #E8E2D8; border-radius:13px; padding:16px 18px; margin-bottom:8px; }
.acc-detail-title { font-size:13px; font-weight:500; color:#1C1917; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.where-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
.wchip       { padding:6px 13px; border:1.5px solid #E0DAD0; border-radius:100px; background:#FFF; cursor:pointer; font-size:12px; color:#4A4139; font-family:'DM Sans',sans-serif; transition:all .2s; }
.wchip:hover { border-color:#9AAB86; }
.wchip.sel   { border-color:#4E6B3F; background:#EFF5EA; color:#2D4A1E; font-weight:500; }
.bal-row { display:flex; align-items:center; gap:10px; }
.bal-lbl { font-size:12px; color:#6B6358; flex-shrink:0; }
.bal-wrap { position:relative; flex:1; }
.bal-inp  { width:100%; padding:8px 12px 8px 26px; border:1.5px solid #E0DAD0; border-radius:10px; font-size:14px; font-weight:500; color:#1C1917; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .15s; background:#FFF; }
.bal-inp:focus { border-color:#4E6B3F; }
.bal-pre  { position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:13px; color:#A39A8E; pointer-events:none; }

/* Debt cards */
.debt-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px; }
.debt-card { padding:15px 14px; border:1.5px solid #E0DAD0; border-radius:13px; background:#FFF; cursor:pointer; transition:all .2s; position:relative; }
.debt-card:hover { border-color:#C97B2E; }
.debt-card.sel   { border-color:#C97B2E; background:#FFF8F0; }
.debt-card.sel::after { content:'✓'; position:absolute; top:9px; right:11px; font-size:10px; color:#C97B2E; font-weight:600; }
.debt-card .di { font-size:17px; margin-bottom:5px; display:block; }
.debt-card .dn { font-size:13px; font-weight:500; color:#1C1917; }
.debt-detail       { background:#FFF8F0; border:1.5px solid #F0D4A8; border-radius:13px; padding:16px 18px; margin-bottom:8px; }
.debt-detail-title { font-size:13px; font-weight:500; color:#8C5C1A; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.debt-fields { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.dfield label { font-size:11px; color:#A39A8E; margin-bottom:4px; display:block; }
.dfield input { width:100%; padding:8px 10px; border:1.5px solid #E0DAD0; border-radius:8px; font-size:13px; font-weight:500; color:#1C1917; font-family:'DM Sans',sans-serif; outline:none; transition:border-color .15s; background:#FFF; }
.dfield input:focus { border-color:#C97B2E; }

/* Budget */
.bhead  { background:#EFF5EA; border-radius:14px; padding:16px 20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; }
.bh-l .bl { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#6B8A57; margin-bottom:3px; }
.bh-l .bv { font-family:'Fraunces',serif; font-size:28px; font-weight:300; color:#1C1917; line-height:1; }
.bh-r .bl { text-align:right; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#A39A8E; margin-bottom:3px; }
.bh-r .bv { font-family:'Fraunces',serif; font-size:28px; font-weight:300; line-height:1; text-align:right; }
.bv.pos  { color:#4E6B3F; }
.bv.warn { color:#C97B2E; }
.bv.neg  { color:#C93E2E; }

/* Actual vs budget toggle */
.avb-toggle { display:flex; background:#EDE8E0; border-radius:100px; padding:3px; margin-bottom:18px; width:fit-content; }
.avb-btn    { padding:7px 18px; border-radius:100px; border:none; font-size:12.5px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; background:transparent; color:#6B6358; }
.avb-btn.on { background:#FFF; color:#1C1917; font-weight:500; box-shadow:0 1px 4px rgba(0,0,0,.08); }

/* Budget rows */
.brow { display:flex; align-items:center; padding:13px 0; border-bottom:1px solid #EDE8E0; gap:12px; }
.brow:last-child { border-bottom:none; }
.bi { font-size:18px; width:26px; flex-shrink:0; }
.bt { flex:1; }
.bn { font-size:14px; font-weight:500; color:#1C1917; }
.bh { font-size:11px; color:#A39A8E; margin-top:1px; }
.binp-wrap { position:relative; flex-shrink:0; }
.binp-pre  { position:absolute; left:7px; top:50%; transform:translateY(-50%); font-size:12px; color:#A39A8E; pointer-events:none; }
.binp { width:100px; text-align:right; font-size:15px; font-weight:500; color:#1C1917; font-family:'DM Sans',sans-serif; border:none; background:transparent; outline:none; padding:6px 8px 6px 20px; border-radius:8px; transition:background .15s; }
.binp:focus { background:#F0EDE6; }
.actual-pill { font-size:11.5px; padding:3px 9px; border-radius:100px; flex-shrink:0; }
.actual-over  { background:#FFF0F0; color:#C93E2E; }
.actual-under { background:#EFF5EA; color:#4E6B3F; }
.actual-ok    { background:#F5F0E8; color:#8C8278; }

/* Spending import banner */
.pull-banner { background:#1C1917; border-radius:14px; padding:16px 18px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; gap:14px; cursor:pointer; transition:all .2s; }
.pull-banner:hover { background:#252018; }
.pb-l .pb-label { font-size:11.5px; color:#6B6358; margin-bottom:3px; }
.pb-l .pb-text  { font-size:14px; color:#F7F3EC; font-weight:500; }
.pb-cta { font-size:12px; color:#9AAB86; white-space:nowrap; border:1px solid #3D3730; padding:6px 13px; border-radius:100px; flex-shrink:0; }
.pull-modal { background:#FFF; border:1.5px solid #E0DAD0; border-radius:16px; padding:18px 20px; margin-bottom:16px; animation:fadeUp .3s ease; }
.pm-title   { font-size:13px; font-weight:500; color:#1C1917; margin-bottom:12px; }
.txr        { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid #F0EDE6; }
.txr:last-child { border-bottom:none; }
.txr .tr-n  { font-size:13px; color:#1C1917; }
.txr .tr-d  { font-size:11px; color:#A39A8E; }
.txr .tr-c  { font-size:10.5px; color:#6B8A57; background:#EFF5EA; padding:2px 8px; border-radius:100px; }
.txr .tr-a  { font-size:13.5px; font-weight:500; color:#1C1917; }
.import-btn { width:100%; margin-top:12px; padding:12px; background:#EFF5EA; color:#2D4A1E; border:1.5px solid #9AAB86; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
.import-btn:hover { background:#E0EDDA; }

/* Goals */
.ggrid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:24px; }
.gcrd  { padding:16px 15px; border:1.5px solid #E0DAD0; border-radius:13px; background:#FFF; cursor:pointer; transition:all .2s; position:relative; }
.gcrd:hover { border-color:#9AAB86; transform:translateY(-1px); }
.gcrd.sel   { border-color:#4E6B3F; background:#EFF5EA; }
.gcrd.sel::after { content:'✓'; position:absolute; top:9px; right:11px; font-size:10px; color:#4E6B3F; font-weight:600; }
.gcrd .gi { font-size:19px; margin-bottom:6px; display:block; }
.gcrd .gn { font-size:13px; font-weight:500; color:#1C1917; }
.gcrd .gd { font-size:11px; color:#A39A8E; margin-top:2px; line-height:1.4; }

/* Callout / insight */
.insight      { border-left:3px solid #4E6B3F; padding:13px 17px; background:#FAFAF6; border-radius:0 11px 11px 0; margin:14px 0; }
.insight p    { font-size:13.5px; color:#4A4139; line-height:1.7; }
.insight strong { color:#2D4A1E; }
.insight.warn   { border-left-color:#C97B2E; background:#FFF9F2; }
.insight.warn p { color:#7A4A18; }
.insight.red    { border-left-color:#C93E2E; background:#FFF5F5; }
.insight.red p  { color:#8C1A1A; }

/* Fee comparison */
.fee-vs   { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:18px 0; }
.fee-card { border-radius:16px; padding:20px 18px; }
.fee-card.bank { background:#F5F0E8; border:1.5px solid #DDD8CF; }
.fee-card.ws   { background:#EFF5EA; border:1.5px solid #9AAB86; }
.fc-label { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#A39A8E; margin-bottom:8px; }
.fee-card.ws .fc-label { color:#6B8A57; }
.fc-name  { font-family:'Fraunces',serif; font-size:18px; font-weight:300; margin-bottom:4px; }
.fee-card.ws .fc-name { color:#2D4A1E; }
.fc-mer   { font-size:26px; font-family:'Fraunces',serif; font-weight:300; margin-bottom:2px; }
.fee-card.bank .fc-mer { color:#C93E2E; }
.fee-card.ws   .fc-mer { color:#4E6B3F; }
.fc-sub   { font-size:11.5px; color:#A39A8E; margin-bottom:12px; }
.fc-item  { font-size:12px; color:#4A4139; display:flex; gap:6px; line-height:1.4; margin-bottom:6px; }

/* Growth chart */
.chart-wrap   { background:#FFF; border:1.5px solid #E0DAD0; border-radius:16px; padding:22px; margin:14px 0; }
.chart-legend { display:flex; gap:18px; margin-bottom:16px; flex-wrap:wrap; }
.cl     { display:flex; align-items:center; gap:6px; font-size:12px; color:#6B6358; }
.cl-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.chart-final { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; padding-top:14px; border-top:1px solid #EDE8E0; }
.cf    { padding:13px 15px; border-radius:11px; }
.cf.ws { background:#EFF5EA; }
.cf.bank { background:#F5F0E8; }
.cf .cf-l { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#A39A8E; margin-bottom:4px; }
.cf.ws .cf-l { color:#6B8A57; }
.cf .cf-v { font-family:'Fraunces',serif; font-size:26px; font-weight:300; line-height:1; }
.cf.ws   .cf-v { color:#2D4A1E; }
.cf.bank .cf-v { color:#8C8278; }
.cf .cf-s { font-size:11px; color:#A39A8E; margin-top:2px; }
.diff-callout { background:#1C1917; border-radius:12px; padding:16px 18px; margin-top:8px; display:flex; justify-content:space-between; align-items:center; }
.dc-l { font-size:13px; color:#8C8278; }
.dc-v { font-family:'Fraunces',serif; font-size:26px; font-weight:300; color:#9AAB86; }

/* Debt repayment strategy */
.strategy-row { display:flex; gap:8px; margin-bottom:16px; }
.strat-btn    { flex:1; padding:13px 12px; border:1.5px solid #E0DAD0; border-radius:12px; background:#FFF; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; text-align:center; }
.strat-btn:hover { border-color:#9AAB86; }
.strat-btn.sel   { border-color:#4E6B3F; background:#EFF5EA; }
.strat-btn .sb-name { font-size:14px; font-weight:500; color:#1C1917; margin-bottom:3px; }
.strat-btn .sb-sub  { font-size:11.5px; color:#A39A8E; }
.debt-plan-card { border:1.5px solid #F0D4A8; border-radius:14px; background:#FFF; padding:18px 20px; margin-bottom:8px; }
.dp-top  { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
.dp-name { font-size:15px; font-weight:500; color:#1C1917; }
.dp-rate { font-size:12px; color:#C97B2E; font-weight:500; margin-top:2px; }
.dp-amt  { font-family:'Fraunces',serif; font-size:22px; font-weight:300; color:#C97B2E; line-height:1; }
.dp-lbl  { font-size:10.5px; color:#A39A8E; text-align:right; }
.dp-why  { font-size:13px; color:#4A4139; line-height:1.65; }
.dp-bar-track { height:3px; background:#F0EDE6; border-radius:2px; margin-top:12px; overflow:hidden; }
.dp-bar-fill  { height:100%; border-radius:2px; background:#C97B2E; width:var(--w); animation:barGrow 1s .2s ease both; }

/* Net worth panel */
.nw-panel { background:#1C1917; border-radius:20px; padding:24px; margin:18px 0; }
.nw-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #2D2922; }
.nw-row:last-of-type { border-bottom:none; }
.nw-l   { font-size:13px; color:#8C8278; }
.nw-v   { font-size:13px; font-weight:500; }
.nw-pos { color:#9AAB86; }
.nw-neg { color:#E87070; }
.nw-tot { color:#F7F3EC; font-size:14px !important; }

/* Monthly flow (dark panel, 2-col grid) */
.flow       { background:#1C1917; border-radius:20px; padding:24px 26px; margin:18px 0; }
.flow-title { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#6B6358; margin-bottom:14px; }
.fs-l { font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:#6B6358; margin-bottom:4px; }
.fs-v { font-family:'Fraunces',serif; font-size:18px; font-weight:300; color:#F7F3EC; line-height:1; }
.fs-s { font-size:10.5px; color:#4A4139; margin-top:2px; }

/* Investment allocation */
.alloc        { border:1.5px solid #E0DAD0; border-radius:16px; background:#FFF; padding:20px 22px; margin-bottom:9px; }
.alloc-badge  { display:inline-flex; align-items:center; background:#EFF5EA; color:#4E6B3F; font-size:10px; font-weight:500; padding:4px 10px; border-radius:100px; letter-spacing:.04em; margin-bottom:7px; }
.alloc-name   { font-family:'Fraunces',serif; font-size:21px; font-weight:300; color:#1C1917; margin-bottom:2px; }
.alloc-label  { font-size:12px; color:#A39A8E; margin-bottom:5px; }
.alloc-purpose { font-size:13px; color:#5A7B45; font-weight:500; margin-bottom:9px; }
.alloc-top    { display:flex; justify-content:space-between; align-items:flex-start; }
.alloc-right  { text-align:right; flex-shrink:0; padding-left:12px; }
.alloc-amt    { font-family:'Fraunces',serif; font-size:24px; font-weight:400; color:#1C1917; line-height:1; }
.alloc-why    { font-size:13.5px; color:#4A4139; line-height:1.65; }
.bar-track    { height:3px; background:#F0EDE6; border-radius:2px; margin-top:12px; overflow:hidden; }
.bar-fill     { height:100%; border-radius:2px; background:#4E6B3F; width:var(--w); animation:barGrow 1s .2s ease both; }

/* Summary table */
.sum-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #EDE8E0; font-size:14px; }
.sum-row:last-child { border-bottom:none; }
.sr-l { color:#6B6358; }
.sr-v { font-weight:500; color:#1C1917; }

/* Surplus */
.surplus   { border:1.5px dashed #C4D4B8; border-radius:14px; padding:16px 20px; margin-bottom:9px; background:#FAFAF6; }
.surplus-l { font-size:12px; color:#6B8A57; font-weight:500; margin-bottom:3px; }

/* Wealthsimple product grid */
.ws-offerings { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:14px 0; }
.ws-offer       { padding:16px 16px; border:1.5px solid #C4D4B8; border-radius:14px; background:#F7FAF4; transition:all .2s; }
.ws-offer:hover { border-color:#4E6B3F; transform:translateY(-1px); }
.ws-offer .wo-icon  { font-size:20px; margin-bottom:7px; display:block; }
.ws-offer .wo-name  { font-size:13.5px; font-weight:500; color:#1C1917; margin-bottom:3px; }
.ws-offer .wo-desc  { font-size:11.5px; color:#6B6358; line-height:1.45; }
.ws-offer .wo-badge { display:inline-block; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; color:#4E6B3F; background:#EFF5EA; padding:2px 8px; border-radius:100px; margin-top:6px; }

/* Transfer cards */
.transfer-card  { background:#FFF; border:1.5px solid #E0DAD0; border-radius:16px; padding:20px 22px; margin-bottom:10px; }
.tc-top  { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
.tc-name  { font-size:14px; font-weight:500; color:#1C1917; }
.tc-where { font-size:12px; color:#A39A8E; margin-top:2px; }
.tc-badge { font-size:10px; color:#4E6B3F; background:#EFF5EA; padding:4px 10px; border-radius:100px; font-weight:500; white-space:nowrap; }
.tc-why   { font-size:13px; color:#4A4139; line-height:1.65; margin-bottom:12px; }
.tc-btn   { width:100%; padding:11px; background:#1C1917; color:#F7F3EC; border:none; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
.tc-btn:hover { background:#2C2820; }

/* CTA strip */
.cta-strip       { background:#EFF5EA; border:1.5px solid #9AAB86; border-radius:16px; padding:20px 22px; margin:16px 0; }
.cta-strip-title { font-family:'Fraunces',serif; font-size:20px; font-weight:300; color:#1C1917; margin-bottom:4px; }
.cta-strip .em   { font-style:italic; color:#4E6B3F; }
.cta-strip-sub   { font-size:13px; color:#6B6358; margin-bottom:14px; line-height:1.55; }
.cta-main-btn    { display:block; width:100%; padding:13px 20px; background:#4E6B3F; color:#FFF; border:none; border-radius:12px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; text-align:center; text-decoration:none; }
.cta-main-btn:hover { background:#3D5530; }

/* Next step action items */
.action       { background:#F7FAF4; border:1.5px solid #C4D4B8; border-radius:13px; padding:15px 17px; margin-bottom:7px; }
.action-top   { display:flex; align-items:center; gap:9px; margin-bottom:5px; }
.action-num   { width:21px; height:21px; border-radius:50%; background:#4E6B3F; color:#FFF; font-size:10.5px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.action-title { font-size:14px; font-weight:500; color:#1C1917; }
.action-desc  { font-size:13px; color:#4A4139; line-height:1.65; padding-left:30px; }

/* About / project note */
.about-note { background:#F5F0E8; border:1.5px solid #DDD8CF; border-radius:16px; padding:22px 24px; margin-top:36px; }
.about-note .an-title { font-family:'Fraunces',serif; font-size:18px; font-weight:300; color:#1C1917; margin-bottom:10px; }
.about-note p  { font-size:13px; color:#6B6358; line-height:1.75; margin-bottom:8px; }
.about-note p:last-child { margin-bottom:0; }
.about-note strong { color:#4A4139; }

/* Tight budget warning */
.tight-warn   { background:#FFF8F0; border:1.5px solid #E8C87A; border-radius:13px; padding:16px 18px; margin:12px 0; }
.tight-warn p { font-size:13px; color:#8C5C1A; line-height:1.65; }

/* Misc */
.disc    { font-size:11px; color:#B5AFA7; line-height:1.75; margin-top:24px; padding-top:18px; border-top:1px solid #E8E2D8; }
.restart { display:inline-flex; align-items:center; gap:5px; font-size:13px; color:#A39A8E; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; margin-top:20px; transition:color .2s; }
.restart:hover { color:#1C1917; }

/* Buttons */
.btn        { display:inline-flex; align-items:center; gap:8px; padding:13px 26px; background:#1C1917; color:#F7F3EC; border:none; border-radius:100px; font-size:14px; font-weight:400; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; }
.btn:hover  { background:#2C2820; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.15); }
.btn:disabled { background:#C8C2B8; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-ghost        { display:inline-flex; align-items:center; padding:12px 18px; background:transparent; color:#8C8278; border:1.5px solid #E0DAD0; border-radius:100px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; margin-left:8px; }
.btn-ghost:hover  { border-color:#A39A8E; color:#1C1917; }
`;

// ─── TAX LOGIC — 2025 CRA CONFIRMED BRACKETS ─────────────────────────────────
//
// Sources:
//   Federal:     https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html
//   CPP2:        2025 ceiling $73,200 / Year's Maximum Pensionable Earnings $68,500
//   EI:          2025 premium rate 1.64% on insurable earnings up to $65,700
//   Ontario surtax: 20% on basic provincial tax > $5,315; additional 36% on basic prov tax > $6,802
//                   Both tiers are cumulative (20% continues above the $6,802 threshold)

const FED_BPA = 16129;
const FED_BR  = [
  [57375,  0.15],
  [57375,  0.205],
  [63790,  0.26],
  [66481,  0.29],
  [Infinity, 0.33],
];

const PROV_DATA = {
  ON: { bpa: 11865, br: [[51446,.0505],[51448,.0915],[50197,.1116],[70000,.1216],[Infinity,.1316]], surtax: true  },
  BC: { bpa: 11981, br: [[47937,.0506],[47937,.077],[14212,.105],[23599,.1229],[47601,.147],[71555,.168],[Infinity,.205]] },
  AB: { bpa: 21883, br: [[148269,.10],[29653,.12],[59308,.13],[118615,.14],[Infinity,.15]] },
  QC: { bpa: 17183, br: [[53255,.14],[53255,.19],[23065,.24],[Infinity,.2575]] },
  SK: { bpa: 17661, br: [[49720,.105],[92338,.125],[Infinity,.145]] },
  MB: { bpa: 15780, br: [[36842,.108],[42783,.1275],[Infinity,.174]] },
  NS: { bpa: 8481,  br: [[29590,.0879],[29590,.1495],[33820,.1667],[57000,.175],[Infinity,.21]] },
  NB: { bpa: 12458, br: [[47715,.094],[47716,.1482],[81325,.1652],[Infinity,.195]] },
  NL: { bpa: 10585, br: [[43198,.087],[43197,.145],[67849,.158],[61699,.178],[59927,.198],[275869,.208],[Infinity,.213]] },
  PE: { bpa: 12000, br: [[32656,.0965],[31657,.1363],[40687,.1665],[35000,.18],[Infinity,.1875]] },
  YT: { bpa: 16129, br: [[57375,.064],[57375,.09],[63790,.109],[Infinity,.128]] },
  NT: { bpa: 16593, br: [[50597,.059],[50601,.086],[63327,.122],[Infinity,.1405]] },
  NU: { bpa: 17925, br: [[53268,.04],[53269,.07],[66668,.09],[Infinity,.115]] },
};

function applyBrackets(taxable, brackets) {
  let tax = 0, remaining = taxable;
  for (const [size, rate] of brackets) {
    const chunk = Math.min(remaining, size);
    tax += chunk * rate;
    remaining -= chunk;
    if (remaining <= 0) break;
  }
  return tax;
}

function calcTax(income, prov) {
  const fed = applyBrackets(Math.max(income - FED_BPA, 0), FED_BR);
  const pd  = PROV_DATA[prov] || PROV_DATA.ON;
  let pTax  = applyBrackets(Math.max(income - pd.bpa, 0), pd.br);

  // Ontario surtax — applied to basic provincial tax, not income
  if (pd.surtax) {
    let surtax = 0;
    if (pTax > 5315) surtax += (pTax - 5315) * 0.20;   // 20% on excess above $5,315
    if (pTax > 6802) surtax += (pTax - 6802) * 0.36;   // additional 36% above $6,802
    pTax += surtax;
  }

  // CPP 2025: base earnings $3,500–$68,500 @ 5.95%; CPP2 $68,500–$73,200 @ 4%
  const cpp = Math.min(Math.max(income - 3500, 0), 65000) * 0.0595
            + (income > 68500 ? Math.min(income - 68500, 4700) * 0.04 : 0);

  // EI 2025: 1.64% on insurable earnings up to $65,700
  const ei = Math.min(income, 65700) * 0.0164;

  const total = fed + pTax + cpp + ei;

  // Approximate combined marginal rate (federal + provincial, ignoring surtax for marginal display)
  const marg = income < 57375
    ? 0.15  + (pd.br[0]?.[1] || 0.05)
    : income < 114750
    ? 0.205 + (pd.br[1]?.[1] || 0.09)
    : 0.26  + (pd.br[2]?.[1] || 0.11);

  return { fed, pTax, cpp, ei, total, afterTax: income - total, eff: income > 0 ? total / income : 0, marg };
}

// ─── SAVINGS ALLOCATION LOGIC ─────────────────────────────────────────────────
//
// Priority order:
//   1. TFSA (emergency fund, if selected)
//   2. FHSA (home goal, age < 40 — $8,000/yr contribution limit)
//   3. TFSA (general — flexible growth / early-retirement bridge)
//   4. RRSP (income ≥ $60K, not early retirement focused)
//   5. RESP (education goal — $2,500/yr triggers full CESG)
//   6. Non-reg (overflow / early-retirement bridge)

function buildAllocs(income, tax, avail, sGoals, lGoals, age) {
  const hasEmerg = sGoals.includes('emergency');
  const hasHome  = sGoals.includes('home');
  const hasEarly = lGoals.includes('retire55');
  const hasEduc  = lGoals.includes('education');
  const allocs   = [];
  let pool = avail;

  const allot = (pct, cap) => {
    const amt = Math.round(Math.min(pool * pct, cap) / 10) * 10;
    pool = Math.max(pool - amt, 0);
    return amt;
  };

  if (hasEmerg) {
    const mo = allot(0.40, 583); // $7,000/yr TFSA limit ÷ 12 ≈ $583
    allocs.push({ account:'TFSA', label:'Tax-Free Savings Account', badge:`${allocs.length+1} — Start here`, purpose:'Emergency fund', monthly:mo, why:'Build 3–6 months of expenses as liquid, tax-free cash. TFSA is ideal: no lock-in, no tax on withdrawal. Once funded, redirect this toward your next goal.' });
  }

  if (hasHome && age < 40) {
    const mo = allot(0.50, 667); // $8,000/yr FHSA limit ÷ 12 ≈ $667
    allocs.push({ account:'FHSA', label:'First Home Savings Account', badge:`${allocs.length+1} — ${allocs.length===0?'Start here':'Then here'}`, purpose:'Down payment', monthly:mo, why:'Tax-deductible contributions + completely tax-free growth. The most powerful account in Canada for first-time buyers. Max the $8,000/year limit — unused room carries forward one year.' });
  }

  if (!hasEmerg) {
    const mo = allot(hasEarly ? 0.55 : 0.40, 583);
    allocs.push({ account:'TFSA', label:'Tax-Free Savings Account', badge:`${allocs.length+1} — ${allocs.length===0?'Start here':'Then here'}`, purpose: hasEarly ? 'Early retirement bridge' : 'Flexible wealth building', monthly:mo, why: hasEarly ? 'Flexible withdrawals with no forced conversion at 71 make this your primary early retirement vehicle. Prioritize over RRSP — you need the access.' : 'Tax-free growth with full withdrawal flexibility. The backbone of most Canadian financial plans regardless of goal.' });
  }

  if (income >= 60000 && !hasEarly && pool > 50) {
    // RRSP 2025 limit: 18% of prior-year earned income, max $32,490
    const maxMonthly = Math.min(income * 0.18, 32490) / 12;
    const mo = allot(0.45, maxMonthly);
    allocs.push({ account:'RRSP', label:'Registered Retirement Savings Plan', badge:`${allocs.length+1} — Then here`, purpose:'Tax-deferred retirement', monthly:mo, why:`Contributions reduce your taxable income at your ~${Math.round(tax.marg*100)}% marginal rate. That annual refund ($${Math.round(mo*tax.marg*12).toLocaleString()}/yr) effectively boosts your return before markets do anything.` });
  }

  if (hasEduc && pool > 30) {
    const mo = allot(0.35, 209); // $2,500/yr for full 20% CESG ÷ 12 ≈ $209
    allocs.push({ account:'RESP', label:'Registered Education Savings Plan', badge:`${allocs.length+1} — Then here`, purpose:"Children's education", monthly:mo, why:'Contribute $2,500/year per child to trigger the full 20% Canada Education Savings Grant — $500 free from Ottawa per child, up to $7,200 lifetime.' });
  }

  if (pool > 50) {
    allocs.push({ account:'Non-Reg', label:'Non-Registered Account', badge:`${allocs.length+1} — Overflow into`, purpose: hasEarly ? 'Bridge to financial independence' : 'Long-term overflow growth', monthly:Math.round(pool/10)*10, why: hasEarly ? 'Accessible capital to live on between financial independence and when you can draw registered retirement income without penalty.' : 'Registered room fills fast at your income. Focus on Canadian dividends and capital gains here to keep effective tax drag low.' });
    pool = 0;
  }

  const total = allocs.reduce((s, a) => s + a.monthly, 0);
  return { allocs, total, surplus: Math.max(avail - total, 0) };
}

// ─── DEBT REPAYMENT LOGIC ─────────────────────────────────────────────────────
//
// Supports avalanche (highest rate first — minimises total interest) and
// snowball (lowest balance first — faster psychological wins).
//
// Amortization formula: n = log(P / (P - B·r)) / log(1+r)
//   where P = payment, B = balance, r = monthly rate
// Guards: payment ≤ monthly interest (balance growing), zero-rate debt, extreme values.

function calcDebtPlan(debtDetails, extraMonthly, strategy) {
  const active = Object.entries(debtDetails)
    .filter(([, d]) => +d?.balance > 0)
    .map(([id, d]) => ({
      id,
      name:     DEBT_TYPES.find(t => t.id === id)?.name || id,
      balance:  +d.balance,
      rate:     Math.max(+d?.rate || 0, 0) / 100 / 12, // monthly decimal
      minPay:   +d?.min || Math.max(+d.balance * 0.02, 25),
    }));

  if (!active.length) return [];

  const sorted = [...active].sort((a, b) =>
    strategy === 'avalanche' ? b.rate - a.rate : a.balance - b.balance
  );

  return sorted.map((d, i) => {
    const totalPay      = d.minPay + (i === 0 ? extraMonthly : 0);
    const monthlyInterest = d.balance * d.rate;

    let months, totalInterest, warning = null;

    if (d.rate === 0) {
      // Zero-interest: simple linear payoff
      months       = Math.ceil(d.balance / Math.max(totalPay, 1));
      totalInterest = 0;
    } else if (totalPay <= monthlyInterest) {
      // Payment doesn't cover interest — balance is growing, not shrinking
      months       = null;
      totalInterest = null;
      warning = `Payment is below monthly interest of $${Math.ceil(monthlyInterest).toLocaleString('en-CA')} — increase to make progress`;
    } else {
      // Standard amortization
      const raw = Math.log(totalPay / (totalPay - monthlyInterest)) / Math.log(1 + d.rate);
      months = Math.ceil(raw);
      if (!isFinite(months) || months > 600) months = 600; // cap at 50 years
      totalInterest = Math.max(totalPay * months - d.balance, 0);
    }

    return { ...d, payoffMonths: months, totalInterest, monthlyPay: totalPay, warning };
  });
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const PROVINCES = [
  { id:'ON', name:'Ontario'    }, { id:'BC', name:'B.C.'       }, { id:'AB', name:'Alberta'   },
  { id:'QC', name:'Quebec'     }, { id:'SK', name:'Sask.'      }, { id:'MB', name:'Manitoba'  },
  { id:'NS', name:'Nova Scotia'}, { id:'NB', name:'N.B.'       }, { id:'NL', name:'N.L.'      },
  { id:'PE', name:'P.E.I.'     }, { id:'YT', name:'Yukon'      }, { id:'NT', name:'N.W.T.'    },
  { id:'NU', name:'Nunavut'    },
];

const ACC_TYPES = [
  { id:'chequing',  icon:'🏦', name:'Chequing',          hint:'Day-to-day spending'      },
  { id:'savings',   icon:'💰', name:'Savings',            hint:'General savings account'  },
  { id:'tfsa',      icon:'🌱', name:'TFSA',               hint:'Tax-free savings'         },
  { id:'rrsp',      icon:'🏔️', name:'RRSP',               hint:'Retirement savings'       },
  { id:'fhsa',      icon:'🏠', name:'FHSA',               hint:'First home savings'       },
  { id:'resp',      icon:'🎓', name:'RESP',               hint:'Education savings'        },
  { id:'employer',  icon:'🏢', name:'Employer plan',      hint:'Group RRSP / pension'     },
  { id:'investing', icon:'📈', name:'Non-reg investing',  hint:'Stocks, ETFs, funds'      },
];

const DEBT_TYPES = [
  { id:'cc',       icon:'💳', name:'Credit card(s)'  },
  { id:'student',  icon:'🎓', name:'Student loan'    },
  { id:'car',      icon:'🚗', name:'Car loan'        },
  { id:'personal', icon:'💰', name:'Personal loan'   },
  { id:'heloc',    icon:'🏠', name:'HELOC'           },
  { id:'other',    icon:'📦', name:'Other debt'      },
];

const WHERE_OPTIONS = ['Wealthsimple', 'Big 5 bank', 'Credit union', 'Employer / work', 'Other'];

const CATS = [
  { id:'housing',   icon:'🏠', label:'Housing',        hint:'Rent, mortgage, utilities'       },
  { id:'transport', icon:'🚗', label:'Transportation',  hint:'Car, transit, fuel'              },
  { id:'groceries', icon:'🛒', label:'Groceries',       hint:'Weekly shopping'                 },
  { id:'dining',    icon:'🍽️', label:'Dining & coffee', hint:'Restaurants, takeout'            },
  { id:'health',    icon:'💊', label:'Health',          hint:'Pharmacy, gym, dental'           },
  { id:'subs',      icon:'📱', label:'Subscriptions',   hint:'Phone, internet, streaming'      },
  { id:'lifestyle', icon:'🎉', label:'Lifestyle',       hint:'Entertainment, hobbies'          },
  { id:'personal',  icon:'✨', label:'Personal',        hint:'Clothing, self-care'             },
  { id:'other',     icon:'📦', label:'Other',           hint:'Gifts, misc'                     },
];

const SHORT_GOALS = [
  { id:'emergency', icon:'🛡️', name:'Emergency fund',      desc:'3–6 months of expenses'   },
  { id:'home',      icon:'🏠', name:'Down payment',         desc:'First home or upgrade'     },
  { id:'car',       icon:'🚗', name:'Vehicle fund',         desc:'New or replacement car'    },
  { id:'travel',    icon:'✈️', name:'Travel / sabbatical',  desc:'Extended time off'         },
  { id:'wedding',   icon:'💍', name:'Wedding',              desc:'Own ceremony or contribution'},
];

const LONG_GOALS = [
  { id:'retire65',  icon:'🌅', name:'Retire at 65',        desc:'Traditional retirement path' },
  { id:'retire55',  icon:'✦',  name:'Retire early',         desc:'Financial independence before 55'},
  { id:'family',    icon:'👶', name:'Start a family',       desc:'Children or growing household'},
  { id:'education', icon:'🎓', name:"Kids' education",      desc:'RESP + post-secondary'       },
  { id:'wealth',    icon:'🌱', name:'Build wealth',         desc:'Patient long-term compounding'},
];

// Simulated Wealthsimple transaction data for the spending import demo
const MOCK_TXN = [
  { name:'Loblaws',      cat:'groceries', amt:87,  date:'Apr 7' },
  { name:'Sobeys',       cat:'groceries', amt:64,  date:'Apr 5' },
  { name:'TTC Monthly',  cat:'transport', amt:156, date:'Apr 1' },
  { name:'Uber',         cat:'transport', amt:22,  date:'Apr 6' },
  { name:'Netflix',      cat:'subs',      amt:18,  date:'Apr 3' },
  { name:'Spotify',      cat:'subs',      amt:11,  date:'Apr 1' },
  { name:'Bell Canada',  cat:'subs',      amt:85,  date:'Apr 1' },
  { name:'LCBO',         cat:'dining',    amt:45,  date:'Apr 6' },
  { name:'Miku Toronto', cat:'dining',    amt:112, date:'Apr 4' },
  { name:'Second Cup',   cat:'dining',    amt:8,   date:'Apr 7' },
  { name:'GoodLife',     cat:'health',    amt:52,  date:'Apr 1' },
  { name:'Sport Chek',   cat:'lifestyle', amt:78,  date:'Apr 5' },
  { name:'Nordstrom',    cat:'personal',  amt:95,  date:'Apr 3' },
  { name:'Amazon',       cat:'other',     amt:44,  date:'Apr 6' },
];

const CAT_LABELS = { groceries:'Groceries', transport:'Transport', subs:'Subscriptions', dining:'Dining', health:'Health', lifestyle:'Lifestyle', personal:'Personal', other:'Other' };

const WS_PRODUCTS = [
  { icon:'🌱', name:'TFSA',              desc:'Tax-free savings & investing for any goal',                    badge:'Most popular' },
  { icon:'🏔️', name:'RRSP',              desc:'Retirement savings with a tax deduction today',               badge:'' },
  { icon:'🏠', name:'FHSA',              desc:'Save for your first home — deductible + tax-free',             badge:'New' },
  { icon:'🎓', name:'RESP',              desc:"Save for kids' education + get the CESG grant",               badge:'' },
  { icon:'📈', name:'Non-registered',    desc:'Invest beyond your registered account limits',                badge:'' },
  { icon:'🏦', name:'Cash account',      desc:'High-interest everyday chequing, no fees',                   badge:'No fees' },
  { icon:'🪙', name:'Crypto',            desc:'Buy and sell crypto with no trading commissions',             badge:'' },
  { icon:'🤖', name:'Managed investing', desc:'Set it and forget it — we build and rebalance your portfolio', badge:'' },
];

// Goal → recommended WS product mapping (used for surfacing relevant products first)
const GOAL_PRODUCTS = {
  home:      ['FHSA', 'TFSA'],
  emergency: ['TFSA', 'Cash account'],
  retire55:  ['TFSA', 'Non-registered'],
  retire65:  ['RRSP', 'TFSA'],
  education: ['RESP', 'TFSA'],
  wealth:    ['Non-registered', 'RRSP'],
  travel:    ['TFSA'],
  family:    ['RESP', 'TFSA'],
};

function defaultBudget(monthlyTakeHome) {
  return {
    housing:   Math.round(Math.min(monthlyTakeHome * 0.33, 2800) / 50) * 50,
    transport: Math.round(Math.min(monthlyTakeHome * 0.11, 700)  / 50) * 50,
    groceries: Math.round(Math.min(monthlyTakeHome * 0.10, 550)  / 50) * 50,
    dining:    Math.round(Math.min(monthlyTakeHome * 0.06, 350)  / 50) * 50,
    health:    Math.round(Math.min(monthlyTakeHome * 0.04, 200)  / 50) * 50,
    subs:      Math.round(Math.min(monthlyTakeHome * 0.03, 175)  / 50) * 50,
    lifestyle: Math.round(Math.min(monthlyTakeHome * 0.05, 300)  / 50) * 50,
    personal:  Math.round(Math.min(monthlyTakeHome * 0.04, 200)  / 50) * 50,
    other:     Math.round(Math.min(monthlyTakeHome * 0.03, 175)  / 50) * 50,
  };
}

// ─── GROWTH CHART ─────────────────────────────────────────────────────────────
//
// Compares two compound growth scenarios over `years`:
//   Wealthsimple: ~6.8% net annual return (index ETFs after ~0.5% all-in cost)
//   Big bank:     ~4.8% net annual return (same gross, minus 2% MER)
//
// chartId prop prevents SVG gradient ID collision when chart renders on multiple steps.

function GrowthChart({ monthly, years, chartId }) {
  const W = 500, H = 200;
  const pad = { t:8, r:8, b:36, l:56 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const WS_RATE = 0.068, BANK_RATE = 0.048;
  const gradId = `wsGrad-${chartId}`;

  const pts = useMemo(() => {
    const ws = [], bk = [];
    let wv = 0, bv = 0;
    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        wv = (wv + monthly * 12) * (1 + WS_RATE);
        bv = (bv + monthly * 12) * (1 + BANK_RATE);
      }
      ws.push(wv);
      bk.push(bv);
    }
    return { ws, bk };
  }, [monthly, years]);

  const maxV = pts.ws[years] || 1;
  const tx = y => pad.l + (y / years) * iW;
  const ty = v => pad.t + iH - (v / maxV) * iH;
  const wsPath = pts.ws.map((v, i) => `${i===0?'M':'L'}${tx(i).toFixed(1)} ${ty(v).toFixed(1)}`).join(' ');
  const bkPath = pts.bk.map((v, i) => `${i===0?'M':'L'}${tx(i).toFixed(1)} ${ty(v).toFixed(1)}`).join(' ');
  const areaPath = wsPath + ` L${tx(years)} ${pad.t+iH} L${tx(0)} ${pad.t+iH} Z`;
  const fmt = n => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1000 ? `$${Math.round(n/1000)}K` : `$${n}`;

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <div className="cl"><div className="cl-dot" style={{background:'#4E6B3F'}} /> Wealthsimple (~6.8% net)</div>
        <div className="cl"><div className="cl-dot" style={{background:'#C4B8A0'}} /> Big bank (~4.8% after 2% MER)</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', overflow:'visible'}}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4E6B3F" stopOpacity=".35" />
            <stop offset="100%" stopColor="#4E6B3F" stopOpacity="0"   />
          </linearGradient>
        </defs>
        {[0, .25, .5, .75, 1].map((f, i) => {
          const v = maxV * f;
          return (
            <g key={i}>
              <line x1={pad.l} x2={W-pad.r} y1={ty(v)} y2={ty(v)} stroke="#EDE8E0" strokeWidth="1" />
              <text x={pad.l-5} y={ty(v)+4} textAnchor="end" fontSize="10" fill="#B5AFA7">{fmt(v)}</text>
            </g>
          );
        })}
        {[0, Math.round(years/4), Math.round(years/2), Math.round(years*3/4), years].map(y => (
          <text key={y} x={tx(y)} y={H-4} textAnchor="middle" fontSize="10" fill="#B5AFA7">
            {y === 0 ? 'Now' : `Yr ${y}`}
          </text>
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={bkPath} fill="none" stroke="#C4B8A0" strokeWidth="2" strokeDasharray="5 3" />
        <path d={wsPath} fill="none" stroke="#4E6B3F" strokeWidth="2.5" />
        <circle cx={tx(years)} cy={ty(pts.ws[years])} r="5" fill="#4E6B3F" />
        <circle cx={tx(years)} cy={ty(pts.bk[years])} r="4" fill="#C4B8A0" />
      </svg>
      <div className="chart-final">
        <div className="cf ws">
          <div className="cf-l">Wealthsimple · {years} yrs</div>
          <div className="cf-v">{fmt(pts.ws[years])}</div>
          <div className="cf-s">{fmt(monthly * 12 * years)} contributed</div>
        </div>
        <div className="cf bank">
          <div className="cf-l">Big bank · {years} yrs</div>
          <div className="cf-v">{fmt(pts.bk[years])}</div>
          <div className="cf-s">Same contributions</div>
        </div>
      </div>
      <div className="diff-callout">
        <span className="dc-l">Wealthsimple advantage</span>
        <span className="dc-v">+{fmt(pts.ws[years] - pts.bk[years])}</span>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step,     setStep]    = useState(0);
  const [openT,    setOT]      = useState(null);
  const [prov,     setProv]    = useState('ON');
  const [income,   setIncome]  = useState(80000);
  const [age,      setAge]     = useState(30);

  // Accounts
  const [accts,    setAccts]   = useState([]);
  const [accWhere, setAW]      = useState({});  // { tfsa: 'Big 5 bank', ... }
  const [accBal,   setAB]      = useState({});  // { tfsa: '12000', ... }

  // Debts
  const [debts,    setDebts]   = useState([]);  // selected debt type ids
  const [debtD,    setDebtD]   = useState({});  // { cc: { balance, rate, min }, ... }
  const [strategy, setStrat]   = useState('avalanche');

  // Budget
  const [budget,   setBudget]  = useState(null);
  const [pullOpen, setPull]    = useState(false);
  const [pulled,   setPulled]  = useState(false);
  const [budView,  setBV]      = useState('budget'); // 'budget' | 'actual'
  const [actuals,  setActuals] = useState(null);     // imported spending by category

  // Goals
  const [sGoals,   setSG]      = useState([]);
  const [lGoals,   setLG]      = useState([]);

  // Animation key — forces re-mount animation on step change
  const [key, setKey] = useState(0);

  // ── Derived values ──────────────────────────────────────────────────────────
  const tax      = useMemo(() => calcTax(income, prov), [income, prov]);
  const moAfter  = tax.afterTax / 12;
  const spend    = budget ? Object.values(budget).reduce((s, v) => s + v, 0) : 0;
  const actualSpend = actuals ? Object.values(actuals).reduce((s, v) => s + v, 0) : spend;

  const totalDebt    = Object.values(debtD).reduce((s, d) => s + (+d?.balance || 0), 0);
  const totalSavings = Object.values(accBal).reduce((s, v) => s + (+v || 0), 0);
  const netWorth     = totalSavings - totalDebt;

  // Split investable surplus between debt repayment and investing
  // High-rate debt (>7% APR) gets 40% of surplus; lower-rate gets 20%
  const hasHighRateDebt = Object.values(debtD).some(d => +d?.rate > 7);
  const debtExtra  = debts.length > 0
    ? Math.round(Math.max(moAfter - spend, 0) * (hasHighRateDebt ? 0.40 : 0.20) / 10) * 10
    : 0;
  const avail = Math.max(moAfter - spend - debtExtra, 0);

  const plan     = useMemo(() => step === 8 ? buildAllocs(income, tax, avail, sGoals, lGoals, age) : null, [step, income, tax, avail, sGoals, lGoals, age]);
  const debtPlan = useMemo(() => calcDebtPlan(debtD, debtExtra, strategy), [debtD, debtExtra, strategy]);
  const horizon  = lGoals.includes('retire55') ? Math.max(55-age,3)
                 : lGoals.includes('retire65') ? Math.max(65-age,3)
                 : sGoals.includes('home')     ? 5
                 : 15;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const go = (s) => {
    if (s === 4 && !budget) setBudget(defaultBudget(moAfter));
    setStep(s);
    setKey(k => k + 1);
    window.scrollTo(0, 0);
  };

  const fm = n => `$${Math.round(n).toLocaleString('en-CA')}`;

  const toggleAcc   = id => setAccts(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const toggleDebt  = id => setDebts(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]);
  const toggleSG    = id => setSG(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  const toggleLG    = id => setLG(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  const setWhere    = (accId, w) => setAW(a => ({ ...a, [accId]: a[accId] === w ? null : w }));
  const setBal      = (accId, v) => setAB(a => ({ ...a, [accId]: v }));
  const updBudget   = (id, raw) => { const n = parseInt(raw.replace(/\D/g,'')) || 0; setBudget(b => ({ ...b, [id]: n })); };
  const updDebt     = (id, field, val) => setDebtD(d => ({ ...d, [id]: { ...d[id], [field]: val } }));

  const rColor = () => {
    const r = moAfter - spend;
    if (r < 0)               return 'neg';
    if (r < moAfter * 0.10)  return 'warn';
    return 'pos';
  };

  // Aggregate mock transactions into budget categories and set as actuals
  const handlePull = () => {
    const agg = {};
    MOCK_TXN.forEach(t => { agg[t.cat] = (agg[t.cat] || 0) + t.amt; });
    // Merge: keep budgeted values for categories not covered by transactions
    setActuals({ ...budget, ...agg });
    setPulled(true);
    setPull(false);
    setBV('actual');
  };

  const handleReset = () => {
    setStep(0); setSG([]); setLG([]); setBudget(null); setAccts([]);
    setAW({}); setAB({}); setDebts([]); setDebtD({});
    setPulled(false); setActuals(null); setBV('budget');
    setIncome(80000); setAge(30); setProv('ON');
    setKey(k => k + 1);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{CSS}</style>

      {step > 0 && step < 8 && (
        <div className="prog">
          {[1,2,3,4,5,6,7].map(s => (
            <div key={s} className={`dot${step===s?' on':step>s?' was':''}`} />
          ))}
        </div>
      )}

      <div className="wrap screen" key={key}>

        {/* ── STEP 0: INTRO ──────────────────────────────────────────── */}
        {step === 0 && (
          <div style={{paddingTop:'11vh'}}>
            <div className="line" />
            <p className="eye">A Wealthsimple concept</p>
            <h1 className="h1">Finally know<br /><em>where it all goes.</em></h1>
            <p className="sub" style={{maxWidth:'420px'}}>Most people have a rough sense of what they earn. Almost nobody knows what they actually keep — or where it could take them. This changes that.</p>
            <p style={{fontSize:'13.5px', color:'#A39A8E', marginBottom:'32px', lineHeight:'1.65'}}>
              Takes about 4 minutes. Builds your real after-tax budget, clears your debt on a timeline, and shows exactly which account gets how much each month.
            </p>
            <button className="btn" onClick={() => go(1)}>Let's build it →</button>
          </div>
        )}

        {/* ── STEP 1: PHILOSOPHY ─────────────────────────────────────── */}
        {step === 1 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 1 of 7 · Philosophy</p>
            <h2 className="h2">First, a quick<br /><em>mindset shift.</em></h2>
            <p className="sub">Three things most people get wrong. Tap to expand.</p>

            {[
              { id:'bu', icon:'🏗️', tag:'Method', title:'Bottom-up budgeting', sub:'Start from zero. Build from reality.',
                body:`Most people budget top-down: take income, hope something's left. Bottom-up is the opposite — you start from what you actually spend, category by category, and build from the ground up.\n\nYour budget becomes grounded in real life, not a fantasy. Harder to build the first time, but the only method that actually sticks long-term. That's what we're doing together.` },
              { id:'zb', icon:'🎯', tag:'Method', title:'Zero-based budgeting', sub:'Every dollar has a job.',
                body:`Zero-based means income minus expenses, savings, and debt payments equals zero. Not because you spend everything — but because every dollar is assigned somewhere.\n\nMoney you don't assign to spending gets assigned to savings or debt. Nothing drifts. This is the difference between "I'll save what's left" (almost nothing) and "I save first, then live on the rest" (actually building wealth).` },
              { id:'pyf', icon:'📖', tag:'The Wealthy Barber', title:'Pay yourself first', sub:'"Save 10% and you\'ll never miss it." — David Chilton',
                body:`Before rent, groceries, or anyone else — move a fixed amount to savings. Automatically. Every payday.\n\nMost people save what's left after spending. The Wealthy Barber says reverse it. The research is clear: people who automate savings consistently build more wealth than those who plan to save "when things settle down."\n\nIn your plan, savings are treated the same as rent: non-negotiable.` },
            ].map(t => (
              <div key={t.id} className={`teach${openT===t.id?' open':''}`} onClick={() => setOT(openT===t.id ? null : t.id)}>
                <div className="ttag">{t.tag}</div>
                <div className="ti">{t.icon}</div>
                <div className="tt">{t.title}</div>
                <div className="ts">{t.sub}</div>
                <div className="tb">{t.body.split('\n\n').map((p, i) => <p key={i} style={{marginBottom:'8px'}}>{p}</p>)}</div>
              </div>
            ))}

            <div style={{marginTop:'28px'}}>
              <button className="btn" onClick={() => go(2)}>Got it — let's go →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: ACCOUNTS + DEBTS ───────────────────────────────── */}
        {step === 2 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 2 of 7 · Accounts & debts</p>
            <h2 className="h2">What's your<br /><em>full picture?</em></h2>
            <p className="sub">Select the accounts and debts you have. This shapes everything that follows.</p>

            <p className="sect">Accounts you have</p>
            <div className="acc-grid">
              {ACC_TYPES.map(a => (
                <div key={a.id} className={`acc-card${accts.includes(a.id)?' sel':''}`} onClick={() => toggleAcc(a.id)}>
                  <span className="ai">{a.icon}</span>
                  <div className="an">{a.name}</div>
                  <div className="ah">{a.hint}</div>
                </div>
              ))}
            </div>

            {accts.length > 0 && (
              <>
                <p className="sect">Where are they held & current balances?</p>
                {accts.map(id => {
                  const acc = ACC_TYPES.find(a => a.id === id);
                  return (
                    <div className="acc-detail" key={id}>
                      <div className="acc-detail-title"><span>{acc.icon}</span>{acc.name}</div>
                      <div className="where-row">
                        {WHERE_OPTIONS.map(w => (
                          <button key={w} className={`wchip${accWhere[id]===w?' sel':''}`} onClick={() => setWhere(id, w)}>{w}</button>
                        ))}
                      </div>
                      <div className="bal-row">
                        <span className="bal-lbl">Balance</span>
                        <div className="bal-wrap">
                          <span className="bal-pre">$</span>
                          <input className="bal-inp" type="text" placeholder="0"
                            value={accBal[id] || ''}
                            onChange={e => setBal(id, e.target.value.replace(/\D/g,''))} />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!accts.includes('tfsa') && (
                  <div className="insight">
                    <p>⚡ <strong>No TFSA yet.</strong> This is the most flexible registered account in Canada — tax-free growth, flexible withdrawals, no income test. Opening one is step one of your plan.</p>
                  </div>
                )}
                {accts.includes('employer') && (
                  <div className="insight">
                    <p>🏢 <strong>Employer plan detected.</strong> If your employer matches contributions, that's an immediate 50–100% guaranteed return. We'll prioritize this before any other account in your plan.</p>
                  </div>
                )}
              </>
            )}

            <p className="sect" style={{marginTop:'28px'}}>Debts you're carrying</p>
            <div className="debt-grid">
              {DEBT_TYPES.map(d => (
                <div key={d.id} className={`debt-card${debts.includes(d.id)?' sel':''}`} onClick={() => toggleDebt(d.id)}>
                  <span className="di">{d.icon}</span>
                  <div className="dn">{d.name}</div>
                </div>
              ))}
            </div>

            {debts.length > 0 && (
              <>
                <p className="sect">Debt details</p>
                {debts.map(id => {
                  const dt = DEBT_TYPES.find(d => d.id === id);
                  const dd = debtD[id] || {};
                  return (
                    <div className="debt-detail" key={id}>
                      <div className="debt-detail-title"><span>{dt.icon}</span>{dt.name}</div>
                      <div className="debt-fields">
                        <div className="dfield">
                          <label>Balance ($)</label>
                          <input type="text" placeholder="0" value={dd.balance || ''}
                            onChange={e => updDebt(id, 'balance', e.target.value.replace(/\D/g,''))} />
                        </div>
                        <div className="dfield">
                          <label>Interest rate (%)</label>
                          <input type="text" placeholder="e.g. 19.99" value={dd.rate || ''}
                            onChange={e => updDebt(id, 'rate', e.target.value)} />
                        </div>
                        <div className="dfield">
                          <label>Min. payment ($)</label>
                          <input type="text" placeholder="auto" value={dd.min || ''}
                            onChange={e => updDebt(id, 'min', e.target.value.replace(/\D/g,''))} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {(totalSavings > 0 || totalDebt > 0) && (
              <>
                <p className="sect">Net worth snapshot</p>
                <div className="nw-panel">
                  {totalSavings > 0 && <div className="nw-row"><span className="nw-l">Total savings & investments</span><span className="nw-v nw-pos">{fm(totalSavings)}</span></div>}
                  {totalDebt    > 0 && <div className="nw-row"><span className="nw-l">Total debts</span><span className="nw-v nw-neg">-{fm(totalDebt)}</span></div>}
                  <div className="nw-row" style={{paddingTop:'8px', borderTop:'1px solid #2D2922', borderBottom:'none', marginTop:'4px'}}>
                    <span className="nw-l" style={{color:'#D4CFC7', fontWeight:500}}>Net worth today</span>
                    <span className={`nw-v ${netWorth>=0?'nw-pos':'nw-neg'} nw-tot`}>{netWorth < 0 ? '-' : ''}{fm(Math.abs(netWorth))}</span>
                  </div>
                </div>
              </>
            )}

            <div style={{marginTop:'24px'}}>
              <button className="btn" onClick={() => go(3)}>Continue →</button>
              <button className="btn-ghost" onClick={() => go(1)}>← Back</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: INCOME & TAX ───────────────────────────────────── */}
        {step === 3 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 3 of 7 · Income & tax</p>
            <h2 className="h2">What does your<br /><em>money actually do?</em></h2>
            <p className="sub">Using 2025 federal and provincial brackets, CPP, and EI — the most current CRA confirmed rates.</p>

            <p className="sect">Province or territory</p>
            <div className="pgrid">
              {PROVINCES.map(p => (
                <button key={p.id} className={`pbtn${prov===p.id?' sel':''}`} onClick={() => setProv(p.id)}>{p.name}</button>
              ))}
            </div>

            <div className="sval">{fm(income)}</div>
            <div className="slbl">Annual gross income</div>
            <input type="range" min={20000} max={300000} step={1000} value={income} className="rng"
              style={{'--p': `${((income-20000)/280000)*100}%`}}
              onChange={e => setIncome(+e.target.value)} />

            <div className="sval" style={{fontSize:'48px'}}>{age}</div>
            <div className="slbl">Your age</div>
            <input type="range" min={18} max={65} value={age} className="rng"
              style={{'--p': `${((age-18)/47)*100}%`}}
              onChange={e => setAge(+e.target.value)} />

            <div className="dark">
              <div className="d-lbl">Monthly take-home</div>
              <div className="d-val">{fm(moAfter)}<span style={{fontSize:'16px', color:'#6B6358'}}>/mo</span></div>
              <div className="d-note" style={{marginBottom:'16px'}}>{fm(tax.afterTax)}/year after all deductions</div>
              {[
                ['Federal income tax', fm(tax.fed  / 12)],
                ['Provincial tax',     fm(tax.pTax / 12)],
                ['CPP contributions',  fm(tax.cpp  / 12)],
                ['EI premiums',        fm(tax.ei   / 12)],
              ].map(([l, v]) => (
                <div className="dr" key={l}><span className="dl">{l}</span><span className="dv">-{v}/mo</span></div>
              ))}
              <div className="dr tot" style={{borderBottom:'none', marginTop:'4px'}}>
                <span className="dl">Total deductions</span><span className="dv">-{fm(tax.total/12)}/mo</span>
              </div>
              <div className="eff">
                <span>Effective rate</span>
                <span>{(tax.eff*100).toFixed(1)}% · {(tax.marg*100).toFixed(0)}% marginal</span>
              </div>
            </div>

            <button className="btn" onClick={() => go(4)}>Build my budget →</button>
            <button className="btn-ghost" onClick={() => go(2)}>← Back</button>
          </div>
        )}

        {/* ── STEP 4: BUDGET ─────────────────────────────────────────── */}
        {step === 4 && budget && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 4 of 7 · Budget</p>
            <h2 className="h2">What does your<br /><em>life cost?</em></h2>
            <p className="sub">Pre-filled with estimates based on your income. Adjust to match your real spending — every edit makes your plan more accurate.</p>

            {!pulled ? (
              <div className="pull-banner" onClick={() => setPull(p => !p)}>
                <div className="pb-l">
                  <div className="pb-label">🔗 Connected to Wealthsimple</div>
                  <div className="pb-text">Import last 30 days of spending automatically</div>
                </div>
                <div className="pb-cta">{pullOpen ? 'Cancel' : 'Import →'}</div>
              </div>
            ) : (
              <div className="insight">
                <p>✅ <strong>Spending imported from Wealthsimple.</strong> Toggle below to compare your budget targets against what you actually spent this month.</p>
              </div>
            )}

            {pullOpen && !pulled && (
              <div className="pull-modal">
                <div className="pm-title">🏦 Recent transactions · Last 30 days</div>
                {MOCK_TXN.slice(0, 8).map((t, i) => (
                  <div className="txr" key={i}>
                    <div><div className="tr-n">{t.name}</div><div className="tr-d">{t.date}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:'9px'}}>
                      <span className="tr-c">{CAT_LABELS[t.cat]}</span>
                      <span className="tr-a">-${t.amt}</span>
                    </div>
                  </div>
                ))}
                <div style={{fontSize:'12px', color:'#A39A8E', marginTop:'8px'}}>+ {MOCK_TXN.length - 8} more transactions</div>
                <button className="import-btn" onClick={handlePull}>Import & auto-fill budget categories</button>
              </div>
            )}

            {pulled && (
              <div className="avb-toggle">
                <button className={`avb-btn${budView==='budget'?' on':''}`} onClick={() => setBV('budget')}>Budgeted</button>
                <button className={`avb-btn${budView==='actual'?' on':''}`} onClick={() => setBV('actual')}>Actual (Apr)</button>
              </div>
            )}

            <div className="bhead">
              <div className="bh-l">
                <div className="bl">Take-home</div>
                <div className="bv">{fm(moAfter)}</div>
              </div>
              <div className="bh-r">
                <div className="bl">Left to save</div>
                <div className={`bv ${rColor()}`}>
                  {moAfter - spend < 0 ? '-' : ''}{fm(Math.abs(moAfter - spend))}
                </div>
              </div>
            </div>

            {moAfter > 0 && (moAfter - spend) > 0 && (moAfter - spend) < moAfter * 0.08 && (
              <div className="tight-warn"><p>⚠️ Your budget is running tight. Look for categories to trim before moving to savings — even a small margin can start building habits.</p></div>
            )}

            <div className="card" style={{padding:'6px 20px', marginBottom:'24px'}}>
              {CATS.map(cat => {
                const budVal = budget[cat.id] || 0;
                const actVal = actuals?.[cat.id] || 0;
                const diff   = actVal - budVal;
                return (
                  <div className="brow" key={cat.id}>
                    <div className="bi">{cat.icon}</div>
                    <div className="bt"><div className="bn">{cat.label}</div><div className="bh">{cat.hint}</div></div>
                    {budView === 'actual' && actuals ? (
                      <>
                        <div style={{textAlign:'right', marginRight:'8px'}}>
                          <div style={{fontSize:'15px', fontWeight:500, color:'#1C1917'}}>${actVal.toLocaleString('en-CA')}</div>
                          <div style={{fontSize:'11px', color:'#A39A8E'}}>budget: ${budVal.toLocaleString('en-CA')}</div>
                        </div>
                        {diff !== 0 && (
                          <span className={`actual-pill ${diff>0?'actual-over':diff<0?'actual-under':'actual-ok'}`}>
                            {diff > 0 ? '+' : ''}{fm(diff)}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="binp-wrap">
                        <span className="binp-pre">$</span>
                        <input className="binp" placeholder="0"
                          value={budVal === 0 ? '' : budVal.toLocaleString('en-CA')}
                          onChange={e => updBudget(cat.id, e.target.value)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pulled && budView === 'actual' && (
              <div className="insight">
                <p>Your actual spend this month is <strong>{fm(actualSpend)}</strong> vs. your budget of <strong>{fm(spend)}</strong> — a difference of{' '}
                  <strong style={{color: actualSpend > spend ? '#C93E2E' : '#4E6B3F'}}>
                    {actualSpend > spend ? '+' : ''}{fm(actualSpend - spend)}
                  </strong>.
                </p>
              </div>
            )}

            <div style={{borderTop:'2px solid #1C1917', paddingTop:'12px', marginBottom:'28px'}}>
              <div className="sum-row"><span className="sr-l" style={{fontWeight:500, color:'#1C1917'}}>Monthly expenses</span><span className="sr-v">{fm(spend)}</span></div>
              <div className="sum-row"><span className="sr-l">Available to save + invest</span><span className="sr-v" style={{color:'#4E6B3F'}}>{fm(Math.max(moAfter-spend,0))}/mo</span></div>
            </div>

            <button className="btn" disabled={moAfter - spend <= 0} onClick={() => go(5)}>Set my goals →</button>
            <button className="btn-ghost" onClick={() => go(3)}>← Back</button>
          </div>
        )}

        {/* ── STEP 5: GOALS ──────────────────────────────────────────── */}
        {step === 5 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 5 of 7 · Goals</p>
            <h2 className="h2">What are you<br /><em>building toward?</em></h2>
            <p className="sub">Your goals determine which accounts we use, in what order, and with how much each month.</p>

            <p className="sect">Short-term (1–5 years)</p>
            <div className="ggrid">
              {SHORT_GOALS.map(g => (
                <div key={g.id} className={`gcrd${sGoals.includes(g.id)?' sel':''}`} onClick={() => toggleSG(g.id)}>
                  <span className="gi">{g.icon}</span><div className="gn">{g.name}</div><div className="gd">{g.desc}</div>
                </div>
              ))}
            </div>

            <p className="sect">Long-term (5+ years)</p>
            <div className="ggrid">
              {LONG_GOALS.map(g => (
                <div key={g.id} className={`gcrd${lGoals.includes(g.id)?' sel':''}`} onClick={() => toggleLG(g.id)}>
                  <span className="gi">{g.icon}</span><div className="gn">{g.name}</div><div className="gd">{g.desc}</div>
                </div>
              ))}
            </div>

            <button className="btn" disabled={sGoals.length + lGoals.length === 0} onClick={() => go(6)}>Continue →</button>
            <button className="btn-ghost" onClick={() => go(4)}>← Back</button>
          </div>
        )}

        {/* ── STEP 6: DEBT REPAYMENT ─────────────────────────────────── */}
        {step === 6 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 6 of 7 · Debt repayment</p>
            <h2 className="h2">Getting out of<br /><em>debt on purpose.</em></h2>

            {debts.length === 0 ? (
              <>
                <p className="sub" style={{marginBottom:'24px'}}>You have no debts recorded — great position to be in. We'll put 100% of your investable surplus to work.</p>
                <div className="insight">
                  <p>💡 <strong>Worth knowing:</strong> if you ever carry a credit card balance, the ~20% interest rate makes it the highest-guaranteed return available — better than any investment. Always eliminate high-rate debt first.</p>
                </div>
              </>
            ) : (
              <>
                <p className="sub" style={{marginBottom:'20px'}}>
                  We'll set aside {fm(debtExtra)}/month toward accelerating your payoff, on top of minimum payments. Choose your strategy:
                </p>
                <div className="strategy-row">
                  <button className={`strat-btn${strategy==='avalanche'?' sel':''}`} onClick={() => setStrat('avalanche')}>
                    <div className="sb-name">⚡ Avalanche</div>
                    <div className="sb-sub">Highest rate first — saves the most interest</div>
                  </button>
                  <button className={`strat-btn${strategy==='snowball'?' sel':''}`} onClick={() => setStrat('snowball')}>
                    <div className="sb-name">❄️ Snowball</div>
                    <div className="sb-sub">Smallest balance first — faster wins</div>
                  </button>
                </div>

                {debtPlan.map((d, i) => (
                  <div className="debt-plan-card" key={d.id}>
                    <div className="dp-top">
                      <div>
                        <div className="dp-name">{i === 0 ? 'Pay off first: ' : 'Then: '}{d.name}</div>
                        <div className="dp-rate">{(d.rate * 1200).toFixed(1)}% APR · Min {fm(d.minPay)}/mo</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="dp-amt">{fm(d.monthlyPay)}</div>
                        <div className="dp-lbl">per month</div>
                      </div>
                    </div>

                    {d.warning ? (
                      <div className="dp-why" style={{color:'#C93E2E'}}>⚠️ {d.warning}.</div>
                    ) : (
                      <div className="dp-why">
                        Paid off in <strong>{d.payoffMonths >= 600 ? '50+' : d.payoffMonths} months</strong>
                        {d.payoffMonths < 600 && <> (~{(d.payoffMonths/12).toFixed(1)} years)</>}.
                        {d.totalInterest != null && <> Total interest: <strong>{fm(d.totalInterest)}</strong>.</>}
                        {i === 0 && debtExtra > 0 && ` ${fm(debtExtra)}/mo extra accelerates this significantly.`}
                      </div>
                    )}

                    <div className="dp-bar-track">
                      <div className="dp-bar-fill" style={{'--w': `${Math.min(100, Math.round((d.monthlyPay / (d.balance||1)) * 100 * 12))}%`}} />
                    </div>
                  </div>
                ))}

                {hasHighRateDebt && (
                  <div className="insight warn">
                    <p>⚠️ <strong>You have high-rate debt.</strong> We're allocating {fm(debtExtra)}/month to accelerated repayment before investing. Once your highest-rate debt clears, that full amount redirects to your investment accounts.</p>
                  </div>
                )}
              </>
            )}

            <div style={{marginTop:'24px'}}>
              <button className="btn" onClick={() => go(7)}>See fee comparison →</button>
              <button className="btn-ghost" onClick={() => go(5)}>← Back</button>
            </div>
          </div>
        )}

        {/* ── STEP 7: FEES & GROWTH ──────────────────────────────────── */}
        {step === 7 && (
          <div style={{paddingTop:'32px'}}>
            <p className="eye">Step 7 of 7 · The real cost of fees</p>
            <h2 className="h2">What fees are<br /><em>costing you.</em></h2>
            <p className="sub">The biggest drag on long-term wealth isn't bad picks. It's fees you barely notice — compounding against you, silently, every year.</p>

            <div className="fee-vs">
              <div className="fee-card bank">
                <div className="fc-label">Big bank mutual funds</div>
                <div className="fc-name">Traditional</div>
                <div className="fc-mer">~2.0%</div>
                <div className="fc-sub">Management Expense Ratio</div>
                <div className="fc-item"><span>💸</span><span>{fm(avail*12*.02)}/yr on your savings rate</span></div>
                <div className="fc-item"><span>🏛️</span><span>Monthly account fees: $10–30</span></div>
                <div className="fc-item"><span>📞</span><span>Advisor incentivized by fund commissions</span></div>
              </div>
              <div className="fee-card ws">
                <div className="fc-label">Wealthsimple</div>
                <div className="fc-name">Modern</div>
                <div className="fc-mer">~0.5%</div>
                <div className="fc-sub">Total all-in cost</div>
                <div className="fc-item"><span>✅</span><span>{fm(avail*12*.005)}/yr at your savings rate</span></div>
                <div className="fc-item"><span>🎉</span><span>No account fees. No minimums</span></div>
                <div className="fc-item"><span>🤖</span><span>Auto-rebalancing included</span></div>
              </div>
            </div>

            <div className="insight">
              <p>
                <strong>Fee difference on your portfolio:</strong> switching from 2% to 0.5% saves{' '}
                <strong>{fm(avail*12*0.015)}/year</strong> at your savings rate — before compounding.
                That gap widens dramatically over {horizon} years.
              </p>
            </div>

            <p className="sect" style={{marginTop:'24px'}}>What {fm(avail)}/month becomes in {horizon} years</p>
            <GrowthChart monthly={avail} years={horizon} chartId="fees" />

            <div style={{marginTop:'28px'}}>
              <button className="btn" style={{background:'#4E6B3F'}} onClick={() => go(8)}>See my complete plan →</button>
              <button className="btn-ghost" onClick={() => go(6)}>← Back</button>
            </div>
          </div>
        )}

        {/* ── STEP 8: PLAN ───────────────────────────────────────────── */}
        {step === 8 && plan && (
          <div>
            <div style={{paddingTop:'36px', paddingBottom:'20px'}}>
              <p className="tag-g">Your complete plan</p>
              <h2 className="h2" style={{fontSize:'32px'}}>Here's exactly<br /><em>where your money goes.</em></h2>
              <p className="sub" style={{marginBottom:0}}>
                Based on your real take-home in {PROVINCES.find(p => p.id === prov)?.name || prov}, your actual budget, your debts, and your goals.
              </p>
            </div>

            {/* Monthly money flow — 2-col grid to avoid cramping on mobile */}
            <div className="flow">
              <div className="flow-title">Monthly money flow</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 0'}}>
                {[
                  { l:'Gross income', v:fm(income/12),          s:'before tax'                  },
                  { l:'Take-home',    v:fm(moAfter),             s:`${(tax.eff*100).toFixed(0)}% effective rate` },
                  { l:'After living', v:fm(moAfter-spend),       s:`${fm(spend)}/mo expenses`    },
                  ...(debts.length > 0 ? [{ l:'After debt', v:fm(Math.max(moAfter-spend-debtExtra,0)), s:`${fm(debtExtra)}/mo to debt` }] : []),
                  { l:'To invest',    v:fm(avail),               s:`${fm(avail*12)}/yr`, highlight:true },
                ].map((item, i) => (
                  <div key={i} style={{ paddingLeft: i%2===1 ? '16px':'0', borderLeft: i%2===1 ? '1px solid #2D2922':'none' }}>
                    <div className="fs-l">{item.l}</div>
                    <div className="fs-v" style={item.highlight ? {color:'#9AAB86', fontSize:'22px'} : {}}>{item.v}</div>
                    <div className="fs-s">{item.s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Net worth */}
            {(totalSavings > 0 || totalDebt > 0) && (
              <>
                <p className="sect">Current net worth</p>
                <div className="nw-panel">
                  {totalSavings > 0 && <div className="nw-row"><span className="nw-l">Total savings & investments</span><span className="nw-v nw-pos">{fm(totalSavings)}</span></div>}
                  {totalDebt    > 0 && <div className="nw-row"><span className="nw-l">Total debts</span><span className="nw-v nw-neg">-{fm(totalDebt)}</span></div>}
                  <div className="nw-row" style={{paddingTop:'8px', borderTop:'1px solid #2D2922', borderBottom:'none', marginTop:'4px'}}>
                    <span className="nw-l" style={{color:'#D4CFC7', fontWeight:500}}>Net worth today</span>
                    <span className={`nw-v ${netWorth>=0?'nw-pos':'nw-neg'} nw-tot`}>{netWorth < 0 ? '-' : ''}{fm(Math.abs(netWorth))}</span>
                  </div>
                </div>
              </>
            )}

            {/* Investment allocation */}
            <p className="sect">Investment priority stack</p>
            {plan.allocs.map((a, i) => (
              <div className="alloc" key={`${a.account}-${i}`}>
                <div className="alloc-top">
                  <div>
                    <div className="alloc-badge">{a.badge}</div>
                    <div className="alloc-name">{a.account}</div>
                    <div className="alloc-label">{a.label}</div>
                    <div className="alloc-purpose">{a.purpose}</div>
                  </div>
                  <div className="alloc-right">
                    <div className="alloc-amt">{fm(a.monthly)}</div>
                    <div style={{fontSize:'11px', color:'#A39A8E'}}>per month</div>
                    <div style={{fontSize:'11px', color:'#A39A8E', marginTop:'2px'}}>{fm(a.monthly*12)}/yr</div>
                  </div>
                </div>
                <div className="alloc-why">{a.why}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{'--w': `${Math.round((a.monthly/avail)*100)}%`}} />
                </div>
              </div>
            ))}

            {plan.surplus > 50 && (
              <div className="surplus">
                <div className="surplus-l">Unallocated surplus</div>
                <div style={{fontFamily:"'Fraunces',serif", fontSize:'22px', fontWeight:300, marginBottom:'5px'}}>{fm(plan.surplus)}/mo</div>
                <div style={{fontSize:'13px', color:'#6B6358', lineHeight:'1.6'}}>Consider accelerating existing contributions or adding a non-registered account as life evolves.</div>
              </div>
            )}

            {/* Annual snapshot */}
            <p className="sect" style={{marginTop:'24px'}}>Annual snapshot</p>
            <div className="card" style={{padding:'4px 22px', marginBottom:'12px'}}>
              {[
                ['Gross income',        fm(income),                 ''],
                ['Taxes & deductions',  `-${fm(tax.total)}`,        '#8C5C1A'],
                ['Annual take-home',    fm(tax.afterTax),           ''],
                ['Living expenses',     `-${fm(spend*12)}`,         '#8C5C1A'],
                ...(debts.length > 0 ? [['Debt payments', `-${fm(debtExtra*12)}`, '#C97B2E']] : []),
                ['Annual invested',     fm(plan.total*12),          '#4E6B3F'],
                ['Savings rate',        `${Math.round((plan.total*12/income)*100)}% gross · ${Math.round((plan.total*12/tax.afterTax)*100)}% take-home`, '#4E6B3F'],
              ].map(([l, v, c]) => (
                <div className="sum-row" key={l}>
                  <span className="sr-l">{l}</span>
                  <span className="sr-v" style={{color: c || '#1C1917'}}>{v}</span>
                </div>
              ))}
            </div>

            {/* Growth projection */}
            <p className="sect">Projected over {horizon} years with Wealthsimple</p>
            <GrowthChart monthly={avail} years={horizon} chartId="plan" />

            {/* Next steps */}
            <p className="sect" style={{marginTop:'28px'}}>Your next steps</p>
            {[
              !accts.includes('tfsa') && { title:'Open a TFSA with Wealthsimple', desc:"You don't have one yet — this is your highest-priority account. Takes 5 minutes." },
              !accts.includes('fhsa') && sGoals.includes('home') && age < 40 && { title:'Open an FHSA', desc:"You're eligible and every month without one is contribution room you can't get back." },
              { title:`Automate ${fm(plan.allocs[0]?.monthly||200)}/mo to your ${plan.allocs[0]?.account||'TFSA'} on payday`, desc:'Pay yourself first, before you see it in chequing. Set it once and let it compound.' },
              accts.includes('employer') && { title:"Confirm you're capturing your full employer match", desc:"If you're not maxing the match, you're leaving guaranteed returns on the table. Check your HR portal today." },
            ].filter(Boolean).map((a, i) => (
              <div className="action" key={i}>
                <div className="action-top"><div className="action-num">{i+1}</div><div className="action-title">{a.title}</div></div>
                <div className="action-desc">{a.desc}</div>
              </div>
            ))}

            {/* Wealthsimple account offerings */}
            <p className="sect" style={{marginTop:'32px'}}>Open a Wealthsimple account</p>
            {(() => {
              const allGoals = [...sGoals, ...lGoals];
              const priorityNames = new Set(allGoals.flatMap(g => GOAL_PRODUCTS[g] || []).slice(0, 3));
              const priority = WS_PRODUCTS.filter(p => priorityNames.has(p.name));
              const rest     = WS_PRODUCTS.filter(p => !priorityNames.has(p.name));
              return (
                <>
                  {priority.length > 0 && (
                    <>
                      <p style={{fontSize:'12px', color:'#6B8A57', marginBottom:'10px', fontWeight:500}}>Recommended for your goals</p>
                      <div className="ws-offerings" style={{marginBottom:'12px'}}>
                        {priority.map(p => (
                          <div className="ws-offer" key={p.name} style={{borderColor:'#4E6B3F'}}>
                            <span className="wo-icon">{p.icon}</span>
                            <div className="wo-name">{p.name}</div>
                            <div className="wo-desc">{p.desc}</div>
                            {p.badge && <div className="wo-badge">{p.badge}</div>}
                          </div>
                        ))}
                      </div>
                      <p style={{fontSize:'12px', color:'#A39A8E', marginBottom:'10px'}}>All accounts</p>
                    </>
                  )}
                  <div className="ws-offerings">
                    {(priority.length > 0 ? rest : WS_PRODUCTS).map(p => (
                      <div className="ws-offer" key={p.name}>
                        <span className="wo-icon">{p.icon}</span>
                        <div className="wo-name">{p.name}</div>
                        <div className="wo-desc">{p.desc}</div>
                        {p.badge && <div className="wo-badge">{p.badge}</div>}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            <div className="cta-strip" style={{marginTop:'12px'}}>
              <div className="cta-strip-title">Ready to <span className="em">get started?</span></div>
              <div className="cta-strip-sub">Open a free account in under 5 minutes. No minimums, no hidden fees, no branch appointments.</div>
              <a href="https://www.wealthsimple.com/en-ca/accounts" target="_blank" rel="noopener noreferrer">
                <button className="cta-main-btn">Open a Wealthsimple account →</button>
              </a>
            </div>

            {/* Transfer existing accounts */}
            {accts.filter(id => accWhere[id] && accWhere[id] !== 'Wealthsimple').length > 0 && (
              <>
                <p className="sect" style={{marginTop:'28px'}}>Transfer existing accounts to Wealthsimple</p>
                <div className="insight" style={{marginBottom:'14px'}}>
                  <p><strong>Everything in one place.</strong> Transferring consolidates your financial picture under one dashboard, one fee structure, and automatic coordination between accounts. Wealthsimple covers exit fees up to $150 per account.</p>
                </div>
                {accts.filter(id => accWhere[id] && accWhere[id] !== 'Wealthsimple').map(id => {
                  const acc = ACC_TYPES.find(a => a.id === id);
                  const bal = accBal[id] ? `Current balance: ${fm(+accBal[id])}` : '';
                  const annualSaving = accBal[id] ? fm(Math.round(+accBal[id] * 0.015)) : null;
                  return (
                    <div className="transfer-card" key={id}>
                      <div className="tc-top">
                        <div>
                          <div className="tc-name">{acc.icon} {acc.name}</div>
                          <div className="tc-where">Currently at: {accWhere[id]}{bal ? ` · ${bal}` : ''}</div>
                        </div>
                        <div className="tc-badge">Free transfer</div>
                      </div>
                      <div className="tc-why">
                        Moving your {acc.name} to Wealthsimple consolidates your financial picture and{annualSaving
                          ? ` saves an estimated ${annualSaving}/year in fees — money that stays invested and compounds for you.`
                          : ' reduces friction when managing your money.'
                        }
                      </div>
                      <button className="tc-btn">Transfer my {acc.name} to Wealthsimple →</button>
                    </div>
                  );
                })}
              </>
            )}

            {/* About this project */}
            <div className="about-note">
              <div className="an-title">About this project</div>
              <p>
                <strong>Money Mapped</strong> is a product concept I built to demonstrate how Wealthsimple could deepen its relationship with customers earlier in their financial journey — before they have a portfolio to manage.
              </p>
              <p>
                The core insight: most Canadians don't invest because they don't know what's left after they actually live. This tool starts there. Real 2025 tax math, a budget grounded in real spending, debt cleared on a deliberate timeline, then a personalized account allocation — all connected.
              </p>
              <p>
                <strong>What I'd build next:</strong> a net worth trajectory chart showing the compounding effect of starting today vs. 12 months from now, goal progress tracking over time, and a proper OAuth integration so the spending import is real rather than simulated. The "transfer existing accounts" flow would also benefit from a live fee calculator that fetches actual MERs from the user's current holdings.
              </p>
              <p style={{color:'#A39A8E', fontSize:'12px'}}>
                Built by Andrew Newton · April 2026 · This is an independent concept, not affiliated with or endorsed by Wealthsimple.
              </p>
            </div>

            <p className="disc">
              This is an independent product concept built to demonstrate product thinking — not personalized financial advice.
              Tax estimates use 2025 federal and provincial brackets (most current CRA confirmed rates); 2026 brackets are
              typically published in the fall and adjusted for CPI indexation. Projected returns assume consistent contributions
              and historical average annual returns; actual results will vary. Wealthsimple's actual advisory fee is 0.4–0.5%
              plus underlying ETF MERs of approximately 0.1–0.2%. Contribution limits and eligibility rules change annually.
              Speak with a qualified financial advisor for advice specific to your situation.
            </p>

            <button className="restart" onClick={handleReset}>↩ Start over</button>
          </div>
        )}

      </div>
    </div>
  );
}
