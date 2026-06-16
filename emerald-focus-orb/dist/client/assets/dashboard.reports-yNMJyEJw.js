import{r as i,j as e}from"./index-CxYJbAB9.js";import{b as P,c as z,e as R}from"./api-DmfgvmIW.js";import{t as r}from"./index-C96TZufQ.js";import{C as j}from"./clock-B7pF9fQs.js";import{B as S}from"./brain-DcPW-ujP.js";import{c as h}from"./createLucideIcon-Cx99y6Eq.js";import{C as B}from"./circle-play-CSCu3QY5.js";import{L as N}from"./loader-circle-8my6Miaa.js";import{m as E}from"./proxy-DGq5_1hH.js";import{F as H}from"./file-text-ChctJovG.js";const G=h("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);const U=h("ChartNoAxesColumn",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);const V=h("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);function te(){const[a,u]=i.useState([]),[c,m]=i.useState(!0),[v,b]=i.useState(null),[T,k]=i.useState(Date.now()),y=async()=>{try{const t=await P();u(t.sessions||[])}catch(t){console.error("Failed to load sessions for report",t),r.error("Failed to load study sessions")}finally{m(!1)}};i.useEffect(()=>{y()},[]),i.useEffect(()=>{const t=setInterval(()=>k(Date.now()),1e3);return()=>clearInterval(t)},[]);const F=async t=>{b(t);try{await R(t),localStorage.getItem("focusSessionId")===t&&localStorage.removeItem("focusSessionId"),r.success("Tracking stopped and session completed!"),await y()}catch(s){console.error("Failed to stop tracking",s),r.error(s.message||"Failed to stop tracking")}finally{b(null)}},D=async t=>{try{const s=await z(t._id),l=window.open("","_blank");if(!l){r.error("Popup blocked! Please allow popups to download PDF.");return}const n=new Date(t.startTime).toLocaleString(),p=t.endTime?new Date(t.endTime).toLocaleString():"Active Session",g=s.focusLogs&&s.focusLogs.length>0?s.focusLogs.map(o=>{let d="✅ Focused";return o.faceDetected===!1?d="❌ Stepped Away":o.lookingAway===!0&&(d="⚠️ Distracted"),`
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(o.createdAt).toLocaleTimeString()}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; color: ${o.focusScore>=80?"#00A86B":o.focusScore>=60?"#D4AF37":"#DC2626"}">${o.focusScore}%</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${d}</td>
              </tr>
            `}).join(""):'<tr><td colspan="3" style="padding: 20px; text-align: center; color: #64748b;">No eye-tracking data captured during this session.</td></tr>';l.document.write(`
        <html>
          <head>
            <title>Focus Report - Session #${a.length-a.findIndex(o=>o._id===t._id)}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
              .header { border-bottom: 3px solid #00A86B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
              h1 { color: #0f172a; margin: 0; font-size: 28px; }
              .logo { font-size: 20px; font-weight: bold; color: #00A86B; }
              .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
              .meta-item { font-size: 14px; }
              .meta-label { color: #64748b; text-transform: uppercase; font-size: 11px; tracking-wider; font-weight: 600; margin-bottom: 4px; }
              .meta-value { font-weight: 600; color: #0f172a; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th { background-color: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
              tr:hover { background-color: #f8fafc; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Focus Session Report</h1>
              <div class="logo">FocusTrack AI</div>
            </div>
            <div class="meta-grid">
              <div class="meta-item">
                <div class="meta-label">Session Name</div>
                <div class="meta-value">Session #${a.length-a.findIndex(o=>o._id===t._id)} (${t._id.slice(-6)})</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Date</div>
                <div class="meta-value">${new Date(t.startTime).toLocaleDateString()}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Start Time</div>
                <div class="meta-value">${n}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">End Time</div>
                <div class="meta-value">${p}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Average Focus</div>
                <div class="meta-value" style="color: #00A86B; font-size: 18px;">${Math.round(s.averageFocusScore||0)}%</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Distractions Count</div>
                <div class="meta-value">${s.distractionCount||0}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th style="text-align: center;">Focus Score</th>
                  <th style="text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${g}
              </tbody>
            </table>
            <div class="footer">
              Generated by FocusTrack AI. All rights reserved.
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            <\/script>
          </body>
        </html>
      `),l.document.close(),r.success("PDF print window opened")}catch(s){console.error("PDF Download failed",s),r.error("PDF Download failed")}},A=a.length,$=a.filter(t=>!t.endTime).length,x=a.filter(t=>t.endTime&&t.averageFocusScore&&t.averageFocusScore>0),C=x.length>0?Math.round(x.reduce((t,s)=>t+(s.averageFocusScore||0),0)/x.length):0,w=x.reduce((t,s)=>s.endTime?t+(new Date(s.endTime).getTime()-new Date(s.startTime).getTime()):t,0),M=Math.floor(w/(1e3*60*60)),L=Math.floor(w%(1e3*60*60)/(1e3*60)),I=`${M}h ${L}m`;return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("header",{children:[e.jsx("div",{className:"text-xs uppercase tracking-[0.25em] text-accent",children:"Reports"}),e.jsx("h1",{className:"mt-1 font-display text-3xl font-semibold",children:"Download your insights"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 sm:grid-cols-4",children:[e.jsxs("div",{className:"glass-card p-4 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"Total Study Time"}),e.jsx(j,{className:"h-4 w-4 text-accent"})]}),e.jsx("div",{className:"mt-3 font-display text-2xl font-bold text-gradient-gold",children:I})]}),e.jsxs("div",{className:"glass-card p-4 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"Average Focus"}),e.jsx(S,{className:"h-4 w-4 text-primary"})]}),e.jsxs("div",{className:"mt-3 font-display text-2xl font-bold text-gradient-emerald",children:[C,"%"]})]}),e.jsxs("div",{className:"glass-card p-4 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"Total Sessions"}),e.jsx(U,{className:"h-4 w-4 text-accent"})]}),e.jsx("div",{className:"mt-3 font-display text-2xl font-bold text-white/90",children:A})]}),e.jsxs("div",{className:"glass-card p-4 flex flex-col justify-between",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"Active Sessions"}),e.jsx(B,{className:"h-4 w-4 text-rose-400 animate-pulse"})]}),e.jsx("div",{className:"mt-3 font-display text-2xl font-bold text-gradient-rose",children:$})]})]}),c?e.jsxs("div",{className:"flex justify-center py-12 text-muted-foreground",children:[e.jsx(N,{className:"mr-2 h-6 w-6 animate-spin"}),"Loading sessions..."]}):a.length===0?e.jsx("div",{className:"glass-panel p-8 text-center text-muted-foreground",children:"No focus sessions recorded yet. Start a study session to generate reports!"}):e.jsx("div",{className:"grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3",children:a.map((t,s)=>{const l=new Date(t.startTime).toLocaleDateString(),n=t.endTime?new Date(t.endTime).getTime()-new Date(t.startTime).getTime():T-new Date(t.startTime).getTime(),p=Math.floor(n/(1e3*60*60)),g=Math.floor(n%(1e3*60*60)/(1e3*60)),o=Math.floor(n%(1e3*60)/1e3),d=t.endTime?`${p}h ${g}m`:`${p}h ${g}m ${o}s`,_=t.averageFocusScore!==void 0&&t.averageFocusScore!==null&&(t.averageFocusScore>0||t.endTime);return e.jsxs(E.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{delay:s*.05},whileHover:{y:-4},className:"glass-panel relative overflow-hidden p-6",children:[e.jsx("div",{className:"absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl"}),e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${t.endTime?"border-emerald-500/30 bg-emerald-500/10 text-emerald-400":"border-danger/30 bg-danger/10 text-danger animate-pulse"}`,children:[!t.endTime&&e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-danger animate-ping"}),t.endTime?"Completed":"Active"]}),e.jsxs("span",{className:"flex items-center gap-1 text-xs text-muted-foreground",children:[e.jsx(G,{className:"h-3.5 w-3.5"}),l]})]}),e.jsxs("h3",{className:"mt-4 font-display text-lg font-semibold leading-snug truncate",children:["Session #",a.length-s," (",t._id.slice(-6),")"]}),e.jsxs("div",{className:"mt-5 grid grid-cols-3 gap-2",children:[e.jsx(f,{label:"Avg focus",value:_?`${Math.round(t.averageFocusScore||0)}%`:"--",tone:"emerald",icon:S}),e.jsx(f,{label:"Study time",value:d,tone:"gold",icon:j}),e.jsx(f,{label:"Distractions",value:`${t.totalDistractions||0}`,tone:"rose",icon:V})]}),e.jsx("div",{className:"mt-6 flex gap-2",children:t.endTime?e.jsxs("button",{onClick:()=>D(t),className:"inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110",children:[e.jsx(H,{className:"h-3.5 w-3.5"})," PDF"]}):e.jsx("button",{onClick:()=>F(t._id),disabled:v===t._id,className:"inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 disabled:cursor-not-allowed px-3 py-2.5 text-xs font-semibold text-white glow-red hover:brightness-110 transition-all",children:v===t._id?e.jsxs(e.Fragment,{children:[e.jsx(N,{className:"h-3.5 w-3.5 animate-spin"})," Stopping..."]}):e.jsx(e.Fragment,{children:"Stop Tracking"})})})]})]},t._id)})})]})}function f({label:a,value:u,tone:c,icon:m}){return e.jsxs("div",{className:"rounded-xl border border-border bg-white/5 p-2 flex flex-col justify-between min-h-[64px]",children:[e.jsxs("div",{className:"flex items-center justify-between text-[9px] uppercase tracking-wider text-muted-foreground gap-1",children:[e.jsx("span",{className:"truncate",children:a}),m&&e.jsx(m,{className:"h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-60"})]}),e.jsx("div",{className:`mt-1.5 font-display text-sm font-semibold truncate ${c==="emerald"?"text-gradient-emerald":c==="gold"?"text-gradient-gold":"text-gradient-rose"}`,children:u})]})}export{te as component};
