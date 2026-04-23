import { useState, useRef } from "react";

const A="#1a1a1a", M="#888", B="#e8e5e0", BG="#faf9f7", W="#ffffff";
const sf = (o={}) => ({ fontFamily:"sans-serif", ...o });
const cardStyle = (o={}) => ({ background:W, border:`0.5px solid ${B}`, borderRadius:10, padding:"20px 22px", ...o });
const btnStyle = (o={}) => ({ fontSize:13, padding:"9px 18px", borderRadius:6, cursor:"pointer", fontFamily:"sans-serif", border:"none", ...o });
const inpStyle = (o={}) => ({ padding:"9px 12px", border:`0.5px solid ${B}`, borderRadius:6, fontSize:13, fontFamily:"sans-serif", width:"100%", boxSizing:"border-box", background:W, color:A, ...o });
const Lbl = ({t}) => <p style={sf({fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:M,margin:"0 0 4px"})}>{t}</p>;
const Back = ({onBack}) => <button onClick={onBack} style={btnStyle({background:"none",border:`0.5px solid ${B}`,color:M,marginBottom:20})}>← dashboard</button>;
const Wrap = ({children}) => <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px 48px",background:BG,minHeight:500}}>{children}</div>;
const SectionTitle = ({t}) => <h2 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:22,color:A,margin:"0 0 18px"}}>{t}</h2>;

const TOOLS = [
  {id:"courses",cat:"education",icon:"◎",title:"course player",desc:"modules, lessons, quizzes & certificate"},
  {id:"pricing",cat:"business",icon:"◈",title:"pricing calculator",desc:"find your ideal price point"},
  {id:"onboard",cat:"business",icon:"◉",title:"client onboarding form",desc:"build a client intake form"},
  {id:"contract",cat:"business",icon:"◫",title:"contract generator",desc:"generate a simple service contract"},
  {id:"proposal",cat:"business",icon:"◧",title:"proposal builder",desc:"build a client proposal"},
  {id:"calendar",cat:"content",icon:"◰",title:"30-day calendar",desc:"plan your content month"},
  {id:"caption",cat:"content",icon:"◱",title:"ai caption writer",desc:"ai-powered captions for creators"},
  {id:"brandkit",cat:"content",icon:"◲",title:"brand kit generator",desc:"build your brand system live"},
  {id:"storefront",cat:"sales",icon:"◳",title:"digital storefront",desc:"build your product page"},
  {id:"checkout",cat:"sales",icon:"◴",title:"checkout page builder",desc:"design your checkout flow"},
  {id:"salespage",cat:"sales",icon:"◵",title:"sales page builder",desc:"build a full sales page live"},
];

const CAT_COLORS = {education:"#f0ece4",business:"#e8eef5",content:"#edf5e8",sales:"#f5e8e8"};
const CAT_TEXT = {education:"#7a6e5e",business:"#4a6a8a",content:"#4a7a4a",sales:"#8a4a4a"};

function Entry({onEnter}) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [err,setErr]=useState("");
  const go=()=>{ if(!name.trim()||!email.includes("@")){setErr("please enter your name and a valid email");return;} onEnter(name,email); };
  return (
    <div style={{minHeight:500,display:"flex",alignItems:"center",justifyContent:"center",background:BG,padding:24}}>
      <div style={{width:"100%",maxWidth:380}}>
        <p style={sf({textAlign:"center",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:M,marginBottom:8})}>back room studio</p>
        <h1 style={{textAlign:"center",fontSize:26,fontFamily:"Georgia,serif",fontWeight:400,color:A,margin:"0 0 6px"}}>creator tool suite</h1>
        <p style={sf({textAlign:"center",fontSize:13,color:M,marginBottom:28})}>free access for the back room community</p>
        <div style={cardStyle()}>
          <div style={{marginBottom:12}}><Lbl t="your name"/><input style={inpStyle()} value={name} onChange={e=>setName(e.target.value)} placeholder="first name or handle"/></div>
          <div style={{marginBottom:16}}><Lbl t="email address"/><input style={inpStyle()} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/></div>
          {err&&<p style={sf({fontSize:12,color:"#c05050",marginBottom:10})}>{err}</p>}
          <button style={btnStyle({background:A,color:W,width:"100%",padding:11})} onClick={go}>access tools →</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({user,onSelect}) {
  const cats=["education","business","content","sales"];
  return (
    <div style={{padding:"28px 20px 48px",background:BG,minHeight:500}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
          <div>
            <p style={sf({fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:M,margin:"0 0 4px"})}>back room studio</p>
            <h1 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:24,color:A,margin:0}}>welcome, {user.name}</h1>
          </div>
          <p style={sf({fontSize:12,color:M})}>{TOOLS.length} tools</p>
        </div>
        {cats.map(cat=>(
          <div key={cat} style={{marginBottom:24}}>
            <p style={sf({fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:M,marginBottom:10})}>{cat} tools</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
              {TOOLS.filter(t=>t.cat===cat).map(t=>(
                <div key={t.id} onClick={()=>onSelect(t.id)} style={{...cardStyle({cursor:"pointer"})}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontSize:18,color:A}}>{t.icon}</span>
                    <span style={{fontSize:10,fontFamily:"sans-serif",letterSpacing:"0.1em",textTransform:"uppercase",background:CAT_COLORS[cat],color:CAT_TEXT[cat],padding:"2px 7px",borderRadius:4}}>{cat}</span>
                  </div>
                  <p style={{margin:"0 0 4px",fontSize:14,color:A,fontWeight:500,fontFamily:"sans-serif"}}>{t.title}</p>
                  <p style={sf({fontSize:12,color:M,lineHeight:1.5})}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// COURSE PLAYER
const MODULES_DATA=[
  {id:1,title:"foundations",lessons:[
    {id:1,title:"why digital products",body:"Digital products are the most scalable income stream for solo creators. No inventory, no shipping — just value delivered instantly. In this lesson we break down why templates, guides, and courses beat client work for long-term freedom.",quiz:{q:"What makes digital products scalable?",opts:["High shipping costs","No inventory or fulfillment needed","Requires a big team","Needs a storefront"],ans:1}},
    {id:2,title:"picking your first product",body:"Your first product should solve one specific problem for one specific person. We walk through a 3-question framework: who is frustrated, what are they trying to do, and what would make it 10x easier?",quiz:{q:"What should your first product focus on?",opts:["A broad topic for everyone","One problem for one person","Multiple formats at once","What competitors sell"],ans:1}},
    {id:3,title:"pricing without guessing",body:"Pricing is psychology. The anchor-value method: start with what it would cost to solve the problem without your product, then price at 10–20% of that. Most creators underprice by 3x.",quiz:{q:"The anchor-value method bases price on:",opts:["Your hourly rate","Your competitor's price","What it costs to solve without your product","Random testing"],ans:2}},
  ]},
  {id:2,title:"building your offer",lessons:[
    {id:4,title:"canva template workflow",body:"A sellable Canva template needs locked structure and editable content. Lock your layout, fonts, and brand colors. Leave text boxes, color swatches, and image frames editable. Always test on a fresh account before selling.",quiz:{q:"What should be locked in a sellable template?",opts:["Text boxes","Image frames","Layout, fonts, brand colors","Everything"],ans:2}},
    {id:5,title:"writing your sales page",body:"Five sections every digital product sales page needs: (1) the hook, (2) the problem, (3) your solution, (4) what's inside, (5) the offer with price and CTA. Keep it under 500 words for products under $100.",quiz:{q:"How many core sections does a good sales page need?",opts:["2","5","10","8"],ans:1}},
  ]},
  {id:3,title:"selling without social",lessons:[
    {id:6,title:"your email list is everything",body:"Social platforms rent you an audience. Your email list owns it. Set up a free Flodesk or Kit account, write a 3-email welcome sequence, and put your signup link everywhere.",quiz:{q:"Why is email better than social for selling?",opts:["It's free","You own the audience","More people use email","It looks more professional"],ans:1}},
    {id:7,title:"your storefront setup",body:"You don't need a full website to sell. A single clean page with your product, a short description, a price, and a Gumroad or Stan checkout link is enough. Launch ugly, iterate fast.",quiz:{q:"What do you need minimum to start selling?",opts:["A full website","A social media presence","One page with product + checkout link","A team"],ans:2}},
  ]},
];

function CourseTool({onBack}) {
  const [done,setDone]=useState({});
  const [active,setActive]=useState(null);
  const [quizAns,setQuizAns]=useState(null);
  const [quizChecked,setQuizChecked]=useState(false);
  const [cert,setCert]=useState(false);
  const allLessons=MODULES_DATA.flatMap(m=>m.lessons);
  const doneCount=Object.values(done).filter(Boolean).length;
  const pct=Math.round((doneCount/allLessons.length)*100);
  const allDone=doneCount===allLessons.length;

  const openLesson=(l)=>{ setActive(l); setQuizAns(null); setQuizChecked(false); };
  const markDone=(id)=>{ setDone(d=>({...d,[id]:true})); setActive(null); };

  if(cert) return (
    <Wrap>
      <Back onBack={()=>setCert(false)}/>
      <div style={cardStyle({textAlign:"center",padding:"48px 32px"})}>
        <p style={sf({fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:M,marginBottom:12})}>back room studio</p>
        <p style={sf({fontSize:14,color:M,marginBottom:4})}>this certifies that</p>
        <h2 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:28,color:A,margin:"0 0 4px"}}>creator graduate</h2>
        <p style={sf({fontSize:13,color:M,marginBottom:24})}>has completed all 7 lessons of the back room creator foundations course</p>
        <div style={{width:60,height:1,background:B,margin:"0 auto 24px"}}/>
        <p style={sf({fontSize:12,color:M})}>back room studio · {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}</p>
      </div>
    </Wrap>
  );

  if(active) return (
    <Wrap>
      <Back onBack={()=>setActive(null)}/>
      <div style={cardStyle()}>
        <p style={sf({fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:M,marginBottom:6})}>lesson</p>
        <h2 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:22,color:A,margin:"0 0 16px"}}>{active.title}</h2>
        <p style={sf({fontSize:15,color:A,lineHeight:1.8,marginBottom:24})}>{active.body}</p>
        <div style={{background:BG,borderRadius:8,padding:"18px 20px",marginBottom:20}}>
          <p style={{margin:"0 0 12px",fontSize:14,fontWeight:500,color:A,fontFamily:"sans-serif"}}>{active.quiz.q}</p>
          {active.quiz.opts.map((o,i)=>{
            let bg=W, col=A;
            if(quizChecked){ if(i===active.quiz.ans){bg="#e8f5e8";col="#2a6a2a";} else if(i===quizAns&&i!==active.quiz.ans){bg="#f5e8e8";col="#8a2a2a";} }
            else if(i===quizAns){bg="#f0ece4";col=A;}
            return <div key={i} onClick={()=>!quizChecked&&setQuizAns(i)} style={{padding:"9px 14px",border:`0.5px solid ${quizChecked&&i===active.quiz.ans?"#6a9a6a":B}`,borderRadius:6,marginBottom:6,cursor:quizChecked?"default":"pointer",background:bg,color:col,fontSize:13,fontFamily:"sans-serif"}}>{o}</div>;
          })}
          {!quizChecked&&quizAns!==null&&<button style={btnStyle({background:A,color:W,marginTop:6})} onClick={()=>setQuizChecked(true)}>check answer</button>}
          {quizChecked&&<p style={sf({fontSize:13,color:quizAns===active.quiz.ans?"#2a6a2a":"#8a2a2a",marginTop:8})}>{quizAns===active.quiz.ans?"correct ✓":"not quite — the correct answer is highlighted"}</p>}
        </div>
        {quizChecked&&quizAns===active.quiz.ans&&!done[active.id]&&<button style={btnStyle({background:A,color:W})} onClick={()=>markDone(active.id)}>mark complete →</button>}
        {done[active.id]&&<p style={sf({fontSize:13,color:"#2a6a2a"})}>✓ completed</p>}
      </div>
    </Wrap>
  );

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="course player"/>
      <div style={cardStyle({marginBottom:16})}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={sf({fontSize:13,color:A})}>progress</span>
          <span style={sf({fontSize:13,fontWeight:500,color:A})}>{doneCount}/{allLessons.length} lessons</span>
        </div>
        <div style={{height:6,background:BG,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:A,borderRadius:3,transition:"width 0.3s"}}/>
        </div>
        {allDone&&<button style={btnStyle({background:A,color:W,marginTop:14})} onClick={()=>setCert(true)}>generate certificate →</button>}
      </div>
      {MODULES_DATA.map(mod=>(
        <div key={mod.id} style={{marginBottom:20}}>
          <p style={sf({fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:M,margin:"0 0 8px"})}>module {mod.id} — {mod.title}</p>
          {mod.lessons.map(l=>(
            <div key={l.id} onClick={()=>openLesson(l)} style={{...cardStyle({marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer"})}}>
              <div style={{width:20,height:20,borderRadius:4,border:`0.5px solid ${done[l.id]?A:B}`,background:done[l.id]?A:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {done[l.id]&&<span style={{color:W,fontSize:11}}>✓</span>}
              </div>
              <p style={sf({margin:0,fontSize:14,color:done[l.id]?M:A,textDecoration:done[l.id]?"line-through":"none",flex:1})}>{l.title}</p>
              <span style={sf({fontSize:13,color:M})}>›</span>
            </div>
          ))}
        </div>
      ))}
    </Wrap>
  );
}

// PRICING CALCULATOR
function PricingTool({onBack}) {
  const [cost,setCost]=useState(0);
  const [hours,setHours]=useState(3);
  const [tier,setTier]=useState("mid");
  const [type,setType]=useState("template");
  const mult={low:1.5,mid:2.5,premium:4.5}[tier];
  const base=cost+(hours*25);
  const suggested=Math.round(base*mult/5)*5||27;
  const low=Math.round(suggested*0.7/5)*5;
  const high=Math.round(suggested*1.4/5)*5;
  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="pricing calculator"/>
      <div style={cardStyle()}>
        <div style={{marginBottom:14}}><Lbl t="product type"/>
          <select style={inpStyle()} value={type} onChange={e=>setType(e.target.value)}>
            {["template","ebook","course","guide","bundle","coaching"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{marginBottom:14}}><Lbl t="production cost ($)"/>
          <input type="number" style={inpStyle()} value={cost} onChange={e=>setCost(parseFloat(e.target.value)||0)}/>
        </div>
        <div style={{marginBottom:14}}>
          <Lbl t={`hours to create: ${hours}`}/>
          <input type="range" min="0.5" max="40" step="0.5" value={hours} onChange={e=>setHours(parseFloat(e.target.value))} style={{width:"100%"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <Lbl t="market positioning"/>
          <div style={{display:"flex",gap:8}}>
            {["low","mid","premium"].map(t=>(
              <button key={t} onClick={()=>setTier(t)} style={btnStyle({flex:1,border:`0.5px solid ${tier===t?A:B}`,background:tier===t?A:W,color:tier===t?W:M})}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{background:BG,borderRadius:8,padding:"20px",textAlign:"center"}}>
          <p style={sf({fontSize:12,color:M,marginBottom:4})}>suggested price</p>
          <p style={{fontFamily:"Georgia,serif",fontSize:36,color:A,margin:"0 0 8px",fontWeight:400}}>${suggested}</p>
          <p style={sf({fontSize:12,color:M})}>range: ${low} – ${high}</p>
        </div>
      </div>
    </Wrap>
  );
}

// ONBOARDING FORM BUILDER
const DEF_FIELDS=[
  {id:1,q:"what's your business name?",type:"text",req:true},
  {id:2,q:"what are your main goals for working together?",type:"textarea",req:true},
  {id:3,q:"what's your timeline?",type:"select",opts:["asap","1 month","2–3 months","flexible"],req:false},
  {id:4,q:"what's your budget range?",type:"select",opts:["under $500","$500–$1,000","$1,000–$3,000","$3,000+"],req:false},
];

function OnboardTool({onBack}) {
  const [fields,setFields]=useState(DEF_FIELDS);
  const [newQ,setNewQ]=useState("");
  const [newType,setNewType]=useState("text");
  const [preview,setPreview]=useState(false);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [copied,setCopied]=useState(false);

  const addField=()=>{ if(!newQ.trim()) return; setFields([...fields,{id:Date.now(),q:newQ,type:newType,req:false}]); setNewQ(""); };
  const remove=(id)=>setFields(fields.filter(f=>f.id!==id));
  const copyText=()=>{ navigator.clipboard.writeText(fields.map((f,i)=>`${i+1}. ${f.q}`).join("\n")); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  if(preview) return (
    <Wrap>
      <Back onBack={()=>{ setPreview(false); setSubmitted(false); }}/>
      <SectionTitle t="form preview"/>
      <div style={cardStyle()}>
        {submitted ? (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <p style={{fontFamily:"Georgia,serif",fontSize:22,color:A,fontWeight:400,marginBottom:8}}>thank you.</p>
            <p style={sf({fontSize:14,color:M})}>your responses have been received. we'll be in touch shortly.</p>
          </div>
        ) : (
          <>
            {fields.map(f=>(
              <div key={f.id} style={{marginBottom:16}}>
                <Lbl t={f.q+(f.req?" *":"")}/>
                {f.type==="text"&&<input style={inpStyle()} value={answers[f.id]||""} onChange={e=>setAnswers({...answers,[f.id]:e.target.value})}/>}
                {f.type==="textarea"&&<textarea style={inpStyle({minHeight:80,resize:"vertical"})} value={answers[f.id]||""} onChange={e=>setAnswers({...answers,[f.id]:e.target.value})}/>}
                {f.type==="select"&&<select style={inpStyle()} value={answers[f.id]||""} onChange={e=>setAnswers({...answers,[f.id]:e.target.value})}>{(f.opts||[]).map(o=><option key={o}>{o}</option>)}</select>}
              </div>
            ))}
            <button style={btnStyle({background:A,color:W})} onClick={()=>setSubmitted(true)}>submit →</button>
          </>
        )}
      </div>
    </Wrap>
  );

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="client onboarding form builder"/>
      <div style={cardStyle({marginBottom:16})}>
        <p style={sf({fontSize:13,color:M,marginBottom:14})}>click × to remove a field</p>
        {fields.map((f,i)=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:BG,borderRadius:7,marginBottom:6}}>
            <span style={sf({fontSize:12,color:M,minWidth:16})}>{i+1}.</span>
            <p style={sf({margin:0,fontSize:13,color:A,flex:1})}>{f.q}</p>
            <span style={sf({fontSize:10,color:M,background:B,padding:"2px 7px",borderRadius:4})}>{f.type}</span>
            <button onClick={()=>remove(f.id)} style={btnStyle({background:"none",border:"none",color:M,padding:"2px 6px",fontSize:14})}>×</button>
          </div>
        ))}
      </div>
      <div style={cardStyle({marginBottom:16})}>
        <p style={sf({fontSize:13,fontWeight:500,color:A,marginBottom:12})}>add a question</p>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <input style={inpStyle()} value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="your question..."/>
          <select style={inpStyle({width:120,flexShrink:0})} value={newType} onChange={e=>setNewType(e.target.value)}>
            <option value="text">text</option>
            <option value="textarea">long text</option>
            <option value="select">dropdown</option>
          </select>
        </div>
        <button style={btnStyle({background:A,color:W})} onClick={addField}>add question</button>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button style={btnStyle({background:A,color:W})} onClick={()=>setPreview(true)}>preview form →</button>
        <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M})} onClick={copyText}>{copied?"copied ✓":"copy questions"}</button>
      </div>
    </Wrap>
  );
}

// CONTRACT GENERATOR
function ContractTool({onBack}) {
  const [f,setF]=useState({clientName:"",clientEmail:"",serviceName:"brand design & canva templates",scope:"design of brand kit including logo, color palette, typography, and 5 Canva templates",deliverables:"brand guide PDF, Canva template files, logo suite",timeline:"4 weeks from project kickoff",payment:"$1,200 paid in full before work begins",revisions:"2 rounds of revisions included",provider:"back room studio"});
  const [show,setShow]=useState(false);
  const set=(k,v)=>setF({...f,[k]:v});
  const contract=`SERVICE AGREEMENT\n\nThis agreement is between ${f.provider} ("Provider") and ${f.clientName||"[Client Name]"} ("Client").\n\nSERVICE\n${f.serviceName}\n\nSCOPE OF WORK\n${f.scope}\n\nDELIVERABLES\n${f.deliverables}\n\nTIMELINE\n${f.timeline}\n\nPAYMENT\n${f.payment}\n\nREVISIONS\n${f.revisions}\n\nOWNERSHIP\nAll final deliverables become property of the Client upon receipt of full payment. Provider retains the right to display work in portfolio.\n\nCANCELLATION\nEither party may cancel with 7 days written notice. Work completed prior to cancellation is billable at the agreed rate.\n\nProvider: ${f.provider}\nClient: ${f.clientName||"[Client Name]"} · ${f.clientEmail||"[Client Email]"}\nDate: ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`;

  const fields=[["clientName","client name"],["clientEmail","client email"],["serviceName","service name"],["scope","scope of work"],["deliverables","deliverables"],["timeline","timeline"],["payment","payment terms"],["revisions","revision policy"],["provider","your business name"]];

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="contract generator"/>
      {!show ? (
        <div style={cardStyle()}>
          {fields.map(([k,lbl])=>(
            <div key={k} style={{marginBottom:12}}>
              <Lbl t={lbl}/>
              {["scope","deliverables"].includes(k)
                ? <textarea style={inpStyle({minHeight:64,resize:"vertical"})} value={f[k]} onChange={e=>set(k,e.target.value)}/>
                : <input style={inpStyle()} value={f[k]} onChange={e=>set(k,e.target.value)}/>
              }
            </div>
          ))}
          <button style={btnStyle({background:A,color:W})} onClick={()=>setShow(true)}>generate contract →</button>
        </div>
      ) : (
        <>
          <div style={cardStyle({marginBottom:14,fontFamily:"Georgia,serif",fontSize:14,lineHeight:2,color:A,whiteSpace:"pre-wrap"})}>{contract}</div>
          <div style={{display:"flex",gap:8}}>
            <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M})} onClick={()=>setShow(false)}>← edit</button>
            <button style={btnStyle({background:A,color:W})} onClick={()=>navigator.clipboard.writeText(contract)}>copy contract</button>
          </div>
        </>
      )}
    </Wrap>
  );
}

// PROPOSAL BUILDER
function ProposalTool({onBack}) {
  const [f,setF]=useState({clientName:"",project:"brand design",problem:"you need a cohesive brand identity that attracts your ideal clients",solution:"i'll create a complete visual brand system tailored to your audience and goals",includes:"brand strategy session, logo suite, color palette, typography system, brand guide PDF, 5 Canva templates",timeline:"4 weeks",investment:"$1,200",cta:"reply to this proposal to get started"});
  const [show,setShow]=useState(false);
  const set=(k,v)=>setF({...f,[k]:v});
  const sections=[["the challenge",f.problem],["the solution",f.solution],["what's included",f.includes],["timeline",f.timeline],["investment",f.investment],["next step",f.cta]];
  const fields=[["clientName","client name"],["project","project type"],["problem","the problem you're solving"],["solution","your solution"],["includes","what's included"],["timeline","timeline"],["investment","investment"],["cta","call to action"]];

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="proposal builder"/>
      {!show ? (
        <div style={cardStyle()}>
          {fields.map(([k,lbl])=>(
            <div key={k} style={{marginBottom:12}}>
              <Lbl t={lbl}/>
              {["problem","solution","includes"].includes(k)
                ? <textarea style={inpStyle({minHeight:64,resize:"vertical"})} value={f[k]} onChange={e=>set(k,e.target.value)}/>
                : <input style={inpStyle()} value={f[k]} onChange={e=>set(k,e.target.value)}/>
              }
            </div>
          ))}
          <button style={btnStyle({background:A,color:W})} onClick={()=>setShow(true)}>generate proposal →</button>
        </div>
      ) : (
        <>
          <div style={cardStyle({marginBottom:14})}>
            <p style={sf({fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:M,marginBottom:20})}>back room studio · proposal</p>
            <h2 style={{fontFamily:"Georgia,serif",fontWeight:400,fontSize:22,color:A,marginBottom:6}}>for {f.clientName||"[client]"}</h2>
            <p style={sf({fontSize:13,color:M,marginBottom:24})}>{f.project}</p>
            {sections.map(([h,v])=>(
              <div key={h} style={{marginBottom:18,paddingBottom:18,borderBottom:`0.5px solid ${B}`}}>
                <p style={sf({fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:M,marginBottom:4})}>{h}</p>
                <p style={sf({fontSize:14,color:A,lineHeight:1.6})}>{v}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M})} onClick={()=>setShow(false)}>← edit</button>
            <button style={btnStyle({background:A,color:W})} onClick={()=>navigator.clipboard.writeText(sections.map(([h,v])=>`${h.toUpperCase()}\n${v}`).join("\n\n"))}>copy proposal</button>
          </div>
        </>
      )}
    </Wrap>
  );
}

// 30-DAY CALENDAR
const CAL_TYPES=["value post","behind the scenes","product promo","community question","personal story","tip or tutorial","reshare/testimonial"];
const CAL_BG={"value post":"#e8f0f8","behind the scenes":"#f5ede0","product promo":"#ede0f5","community question":"#e0f5ed","personal story":"#f5e0e0","tip or tutorial":"#f0f5e0","reshare/testimonial":"#f5f0e0"};

function CalendarTool({onBack}) {
  const [cal,setCal]=useState(()=>Array.from({length:30},(_,i)=>({day:i+1,type:CAL_TYPES[i%CAL_TYPES.length],note:""})));
  const [editDay,setEditDay]=useState(null);
  const [noteVal,setNoteVal]=useState("");
  const [typeVal,setTypeVal]=useState("");
  const update=(day,key,val)=>setCal(cal.map(d=>d.day===day?{...d,[key]:val}:d));
  const openEdit=(d)=>{ setEditDay(d.day); setNoteVal(d.note); setTypeVal(d.type); };
  const save=()=>{ update(editDay,"note",noteVal); update(editDay,"type",typeVal); setEditDay(null); };

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="30-day content calendar"/>
      <p style={sf({fontSize:13,color:M,marginBottom:16})}>click any day to edit the post type and add a note</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(88px,1fr))",gap:6}}>
        {cal.map(d=>(
          <div key={d.day} onClick={()=>openEdit(d)} style={{background:CAL_BG[d.type]||"#f5f5f0",borderRadius:8,padding:"10px 8px",cursor:"pointer",border:`0.5px solid ${B}`}}>
            <p style={sf({fontSize:10,color:M,marginBottom:4})}>day {d.day}</p>
            <p style={sf({fontSize:11,color:A,lineHeight:1.3,margin:0})}>{d.type}</p>
            {d.note&&<p style={sf({fontSize:10,color:M,marginTop:4,lineHeight:1.3})}>{d.note.slice(0,28)}{d.note.length>28?"...":""}</p>}
          </div>
        ))}
      </div>
      {editDay&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99}}>
          <div style={cardStyle({width:320,maxWidth:"90vw"})}>
            <p style={sf({fontSize:13,fontWeight:500,color:A,marginBottom:12})}>day {editDay}</p>
            <Lbl t="post type"/>
            <select style={inpStyle({marginBottom:12})} value={typeVal} onChange={e=>setTypeVal(e.target.value)}>
              {CAL_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
            <Lbl t="note or idea"/>
            <textarea style={inpStyle({minHeight:70,resize:"vertical",marginBottom:14})} value={noteVal} onChange={e=>setNoteVal(e.target.value)} placeholder="what will this post be about?"/>
            <div style={{display:"flex",gap:8}}>
              <button style={btnStyle({background:A,color:W})} onClick={save}>save</button>
              <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M})} onClick={()=>setEditDay(null)}>cancel</button>
            </div>
          </div>
        </div>
      )}
    </Wrap>
  );
}

// AI CAPTION WRITER
function CaptionTool({onBack}) {
  const [input,setInput]=useState("");
  const [tone,setTone]=useState("editorial");
  const [platform,setPlatform]=useState("instagram");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);

  const generate=async()=>{
    if(!input.trim()) return;
    setLoading(true); setResult("");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Write a ${platform} caption for a digital product creator. Tone: ${tone}, lowercase, intentional. Topic: ${input}. No hashtags unless platform is instagram. Just the caption, nothing else.`}]})});
      const data=await res.json();
      setResult(data.content?.find(b=>b.type==="text")?.text||"");
    } catch { setResult("couldn't generate — try again"); }
    setLoading(false);
  };

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="ai caption writer"/>
      <div style={cardStyle()}>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:140}}><Lbl t="platform"/>
            <select style={inpStyle()} value={platform} onChange={e=>setPlatform(e.target.value)}>
              {["instagram","twitter/x","linkedin","email subject","pinterest"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{flex:1,minWidth:140}}><Lbl t="tone"/>
            <select style={inpStyle()} value={tone} onChange={e=>setTone(e.target.value)}>
              {["editorial","warm","bold","minimal","conversational"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <Lbl t="what's the post about?"/>
        <textarea style={inpStyle({minHeight:70,resize:"vertical",marginBottom:14})} value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. launching a $37 canva template bundle..."/>
        <button style={btnStyle({background:A,color:W})} onClick={generate}>{loading?"writing...":"generate caption ↗"}</button>
        {result&&<div style={{marginTop:16,background:BG,borderRadius:8,padding:"14px 16px"}}><p style={{margin:0,fontSize:15,fontFamily:"Georgia,serif",fontStyle:"italic",color:A,lineHeight:1.8}}>{result}</p></div>}
      </div>
    </Wrap>
  );
}

// BRAND KIT GENERATOR
const FONTS=["Georgia, serif","Garamond, serif","Palatino, serif","Helvetica, sans-serif","Futura, sans-serif","Gill Sans, sans-serif"];

function BrandKitTool({onBack}) {
  const [f,setF]=useState({name:"back room studio",tagline:"tools for intentional creators",primary:"#1a1a1a",secondary:"#f0ece4",accent:"#8a6a4a",font1:"Georgia, serif",font2:"Helvetica, sans-serif"});
  const set=(k,v)=>setF({...f,[k]:v});

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="brand kit generator"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={cardStyle()}>
          <p style={sf({fontSize:13,fontWeight:500,color:A,marginBottom:14})}>brand details</p>
          {[["name","brand name"],["tagline","tagline"]].map(([k,l])=>(
            <div key={k} style={{marginBottom:10}}><Lbl t={l}/><input style={inpStyle()} value={f[k]} onChange={e=>set(k,e.target.value)}/></div>
          ))}
          <div style={{marginBottom:10}}><Lbl t="headline font"/>
            <select style={inpStyle()} value={f.font1} onChange={e=>set("font1",e.target.value)}>{FONTS.map(fn=><option key={fn}>{fn}</option>)}</select>
          </div>
          <div style={{marginBottom:14}}><Lbl t="body font"/>
            <select style={inpStyle()} value={f.font2} onChange={e=>set("font2",e.target.value)}>{FONTS.map(fn=><option key={fn}>{fn}</option>)}</select>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {[["primary","primary"],["secondary","secondary"],["accent","accent"]].map(([k,l])=>(
              <div key={k}><Lbl t={l}/>
                <input type="color" value={f[k]} onChange={e=>set(k,e.target.value)} style={{width:44,height:36,border:`0.5px solid ${B}`,borderRadius:6,cursor:"pointer",padding:2,display:"block"}}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={cardStyle({background:f.secondary,flex:"none"})}>
            <p style={{fontFamily:f.font1,fontSize:20,color:f.primary,margin:"0 0 4px",fontWeight:400}}>{f.name||"brand name"}</p>
            <p style={{fontFamily:f.font2,fontSize:12,color:f.primary+"99",margin:0}}>{f.tagline||"your tagline"}</p>
          </div>
          <div style={cardStyle({background:f.primary})}>
            <p style={{fontFamily:f.font2,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:f.secondary,margin:"0 0 8px"}}>palette</p>
            <div style={{display:"flex",gap:8}}>
              {[f.primary,f.secondary,f.accent].map((c,i)=>(
                <div key={i} style={{flex:1,height:32,borderRadius:5,background:c,border:`0.5px solid rgba(255,255,255,0.2)`}}/>
              ))}
            </div>
          </div>
          <div style={cardStyle()}>
            <p style={{fontFamily:f.font2,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:M,margin:"0 0 10px"}}>typography</p>
            <p style={{fontFamily:f.font1,fontSize:18,color:A,margin:"0 0 4px",fontWeight:400}}>headline font</p>
            <p style={{fontFamily:f.font2,fontSize:13,color:M,margin:0}}>body font — clean and readable</p>
          </div>
          <div style={cardStyle({background:f.accent,textAlign:"center"})}>
            <p style={{fontFamily:f.font2,fontSize:11,color:f.secondary,margin:"0 0 8px",letterSpacing:"0.08em"}}>accent</p>
            <button style={{fontFamily:f.font2,fontSize:13,background:f.secondary,color:f.primary,border:"none",borderRadius:6,padding:"8px 20px",cursor:"pointer"}}>{f.name||"your brand"}</button>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

// STOREFRONT
function StorefrontTool({onBack}) {
  const [products,setProducts]=useState([
    {id:1,name:"the $37 bundle",price:37,desc:"one-page canva site + analytics guide",link:"#",badge:"best seller"},
    {id:2,name:"ig template pack",price:27,desc:"minimal editorial canva templates",link:"#",badge:""},
  ]);
  const [form,setForm]=useState({name:"",price:"",desc:"",link:"",badge:""});
  const [adding,setAdding]=useState(false);
  const add=()=>{ if(!form.name||!form.price) return; setProducts([...products,{id:Date.now(),...form,price:parseFloat(form.price)}]); setForm({name:"",price:"",desc:"",link:"",badge:""}); setAdding(false); };

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="digital storefront"/>
      <div style={cardStyle({marginBottom:16,textAlign:"center",padding:"32px 24px"})}>
        <p style={sf({fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:M,marginBottom:6})}>back room studio</p>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:400,color:A,marginBottom:4}}>digital products</h2>
        <p style={sf({fontSize:13,color:M})}>templates, guides & tools for creators</p>
      </div>
      {products.map(p=>(
        <div key={p.id} style={cardStyle({marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12})}>
          <div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
              <p style={sf({margin:0,fontSize:15,color:A,fontWeight:500})}>{p.name}</p>
              {p.badge&&<span style={{fontSize:10,fontFamily:"sans-serif",background:"#f0ece4",color:"#7a6e5e",padding:"2px 8px",borderRadius:4}}>{p.badge}</span>}
            </div>
            <p style={sf({margin:0,fontSize:13,color:M})}>{p.desc}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:18,color:A}}>${p.price}</span>
            <a href={p.link||"#"} style={{fontSize:13,fontFamily:"sans-serif",background:A,color:W,padding:"7px 16px",borderRadius:6,textDecoration:"none"}}>get it →</a>
            <button onClick={()=>setProducts(products.filter(x=>x.id!==p.id))} style={btnStyle({background:"none",border:"none",color:M,padding:"4px 8px",fontSize:16})}>×</button>
          </div>
        </div>
      ))}
      {adding ? (
        <div style={cardStyle({marginTop:12})}>
          {[["name","product name"],["price","price"],["desc","description"],["link","checkout link"],["badge","badge (optional)"]].map(([k,l])=>(
            <div key={k} style={{marginBottom:8}}><Lbl t={l}/><input style={inpStyle()} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button style={btnStyle({background:A,color:W})} onClick={add}>add</button>
            <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M})} onClick={()=>setAdding(false)}>cancel</button>
          </div>
        </div>
      ) : (
        <button style={btnStyle({border:`0.5px solid ${B}`,background:W,color:M,marginTop:8})} onClick={()=>setAdding(true)}>+ add product</button>
      )}
    </Wrap>
  );
}

// CHECKOUT PAGE BUILDER
function CheckoutTool({onBack}) {
  const [f,setF]=useState({product:"the $37 bundle",price:"37",desc:"one-page canva site template + google analytics setup guide",bullet1:"minimal, editorial canva template",bullet2:"step-by-step analytics setup",bullet3:"instant digital download",cta:"get instant access",guarantee:"30-day money back guarantee",bg:"#faf9f7",btnColor:"#1a1a1a"});
  const set=(k,v)=>setF({...f,[k]:v});
  const [preview,setPreview]=useState(false);
  const [done,setDone]=useState(false);

  if(preview) return (
    <Wrap>
      <Back onBack={()=>{ setPreview(false); setDone(false); }}/>
      <div style={{background:f.bg,borderRadius:12,overflow:"hidden",border:`0.5px solid ${B}`}}>
        <div style={{padding:"36px 32px",textAlign:"center"}}>
          {done ? (
            <div style={{padding:"32px 0"}}>
              <p style={{fontFamily:"Georgia,serif",fontSize:24,color:A,fontWeight:400,marginBottom:8}}>you're in.</p>
              <p style={sf({fontSize:14,color:M})}>check your email for your download link.</p>
            </div>
          ) : (
            <>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:24,color:A,fontWeight:400,margin:"0 0 8px"}}>{f.product}</h2>
              <p style={{fontFamily:"Georgia,serif",fontSize:32,color:A,margin:"0 0 16px",fontWeight:400}}>${f.price}</p>
              <p style={sf({fontSize:14,color:M,maxWidth:400,margin:"0 auto 20px",lineHeight:1.6})}>{f.desc}</p>
              <ul style={{listStyle:"none",padding:0,margin:"0 auto 24px",maxWidth:320,textAlign:"left"}}>
                {[f.bullet1,f.bullet2,f.bullet3].filter(Boolean).map((b,i)=>(
                  <li key={i} style={sf({fontSize:13,color:A,marginBottom:6,paddingLeft:20,position:"relative"})}>
                    <span style={{position:"absolute",left:0}}>✓</span>{b}
                  </li>
                ))}
              </ul>
              <button onClick={()=>setDone(true)} style={{background:f.btnColor,color:W,border:"none",borderRadius:8,padding:"13px 32px",fontSize:15,cursor:"pointer",fontFamily:"sans-serif",marginBottom:10,display:"block",width:"100%",maxWidth:300,margin:"0 auto 10px"}}>{f.cta}</button>
              {f.guarantee&&<p style={sf({fontSize:12,color:M,marginTop:10})}>{f.guarantee}</p>}
            </>
          )}
        </div>
      </div>
    </Wrap>
  );

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="checkout page builder"/>
      <div style={cardStyle()}>
        {[["product","product name"],["price","price ($)"],["desc","description"],["bullet1","benefit 1"],["bullet2","benefit 2"],["bullet3","benefit 3"],["cta","button text"],["guarantee","guarantee text (optional)"]].map(([k,l])=>(
          <div key={k} style={{marginBottom:10}}><Lbl t={l}/><input style={inpStyle()} value={f[k]} onChange={e=>set(k,e.target.value)}/></div>
        ))}
        <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <div><Lbl t="background color"/><input type="color" value={f.bg} onChange={e=>set("bg",e.target.value)} style={{width:44,height:36,border:`0.5px solid ${B}`,borderRadius:6,cursor:"pointer",padding:2,display:"block"}}/></div>
          <div><Lbl t="button color"/><input type="color" value={f.btnColor} onChange={e=>set("btnColor",e.target.value)} style={{width:44,height:36,border:`0.5px solid ${B}`,borderRadius:6,cursor:"pointer",padding:2,display:"block"}}/></div>
        </div>
        <button style={btnStyle({background:A,color:W})} onClick={()=>setPreview(true)}>preview checkout →</button>
      </div>
    </Wrap>
  );
}

// SALES PAGE BUILDER
function SalesPageTool({onBack}) {
  const [f,setF]=useState({headline:"stop building in the dark.",subheadline:"the back room creator toolkit gives you every tool you need to launch, sell, and grow — without the guesswork.",price:"37",problem:"you're spending hours on tasks that should take minutes. you're googling how to price, what to post, and how to write a bio that converts.",solution:"one toolkit. every tool you actually need as a digital creator.",bullets:"canva site template ready in minutes\ngoogle analytics setup in under an hour\n30-day content plan built for product sellers",testimonial:"this saved me so much time. everything i needed was right there.",testimonialName:"maya r., template creator",cta:"get the bundle for $37",bg:"#faf9f7",accent:"#1a1a1a"});
  const set=(k,v)=>setF({...f,[k]:v});
  const [preview,setPreview]=useState(false);

  if(preview) return (
    <Wrap>
      <Back onBack={()=>setPreview(false)}/>
      <div style={{background:f.bg,borderRadius:12,overflow:"hidden",border:`0.5px solid ${B}`}}>
        <div style={{background:f.accent,padding:"48px 32px",textAlign:"center"}}>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:400,color:W,margin:"0 0 14px",lineHeight:1.2}}>{f.headline}</h1>
          <p style={sf({fontSize:15,color:"rgba(255,255,255,0.7)",maxWidth:480,margin:"0 auto",lineHeight:1.7})}>{f.subheadline}</p>
        </div>
        <div style={{padding:"36px 32px"}}>
          {[["the problem",f.problem],["the solution",f.solution]].map(([h,v])=>(
            <div key={h} style={{marginBottom:28}}>
              <p style={sf({fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:M,marginBottom:8})}>{h}</p>
              <p style={sf({fontSize:15,color:A,lineHeight:1.7})}>{v}</p>
            </div>
          ))}
          <div style={{marginBottom:28}}>
            <p style={sf({fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:M,marginBottom:10})}>what's inside</p>
            {f.bullets.split("\n").filter(Boolean).map((b,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{color:f.accent,fontWeight:500,flexShrink:0,fontFamily:"sans-serif"}}>✓</span>
                <p style={sf({margin:0,fontSize:14,color:A})}>{b}</p>
              </div>
            ))}
          </div>
          {f.testimonial&&(
            <div style={{background:f.accent+"18",borderLeft:`3px solid ${f.accent}`,padding:"16px 20px",marginBottom:28,borderRadius:"0 8px 8px 0"}}>
              <p style={{fontFamily:"Georgia,serif",fontSize:15,fontStyle:"italic",color:A,margin:"0 0 6px"}}>"{f.testimonial}"</p>
              <p style={sf({fontSize:12,color:M,margin:0})}>{f.testimonialName}</p>
            </div>
          )}
          <div style={{textAlign:"center",paddingTop:8}}>
            <p style={{fontFamily:"Georgia,serif",fontSize:28,color:A,margin:"0 0 14px",fontWeight:400}}>${f.price}</p>
            <button style={{background:f.accent,color:W,border:"none",borderRadius:8,padding:"14px 36px",fontSize:16,cursor:"pointer",fontFamily:"sans-serif"}}>{f.cta}</button>
          </div>
        </div>
      </div>
    </Wrap>
  );

  return (
    <Wrap>
      <Back onBack={onBack}/>
      <SectionTitle t="sales page builder"/>
      <div style={cardStyle()}>
        {[["headline","main headline"],["subheadline","subheadline"],["price","price ($)"],["problem","the problem"],["solution","your solution"],["bullets","what's inside (one per line)"],["testimonial","testimonial quote"],["testimonialName","testimonial name"],["cta","button text"]].map(([k,l])=>(
          <div key={k} style={{marginBottom:10}}>
            <Lbl t={l}/>
            {["problem","solution","bullets","testimonial"].includes(k)
              ? <textarea style={inpStyle({minHeight:70,resize:"vertical"})} value={f[k]} onChange={e=>set(k,e.target.value)}/>
              : <input style={inpStyle()} value={f[k]} onChange={e=>set(k,e.target.value)}/>
            }
          </div>
        ))}
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <div><Lbl t="page bg"/><input type="color" value={f.bg} onChange={e=>set("bg",e.target.value)} style={{width:44,height:36,border:`0.5px solid ${B}`,borderRadius:6,cursor:"pointer",padding:2,display:"block"}}/></div>
          <div><Lbl t="accent"/><input type="color" value={f.accent} onChange={e=>set("accent",e.target.value)} style={{width:44,height:36,border:`0.5px solid ${B}`,borderRadius:6,cursor:"pointer",padding:2,display:"block"}}/></div>
        </div>
        <button style={btnStyle({background:A,color:W})} onClick={()=>setPreview(true)}>preview sales page →</button>
      </div>
    </Wrap>
  );
}

// ROOT
const TOOL_MAP={courses:CourseTool,pricing:PricingTool,onboard:OnboardTool,contract:ContractTool,proposal:ProposalTool,calendar:CalendarTool,caption:CaptionTool,brandkit:BrandKitTool,storefront:StorefrontTool,checkout:CheckoutTool,salespage:SalesPageTool};

export default function App() {
  const [user,setUser]=useState(null);
  const [active,setActive]=useState(null);
  if(!user) return <Entry onEnter={(name,email)=>setUser({name,email})}/>;
  if(active){ const Tool=TOOL_MAP[active]; return <Tool onBack={()=>setActive(null)}/>; }
  return <Dashboard user={user} onSelect={setActive}/>;
}
