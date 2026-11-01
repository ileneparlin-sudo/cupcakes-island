/* Stable routine IDs and a single daily reward ledger. No DOM or storage writes. */
(function(root){
  const groups={
    morning:{title:'Morning Adventure',steps:[['dress','Get dressed','Choose one comfy outfit.|Put it on, one piece at a time.',true],['teeth','Brush teeth','Find your toothbrush and toothpaste.|Ask someone to help you start brushing.',true],['breakfast','Eat breakfast','Choose something that feels manageable.|Sit down and try a little breakfast.',false],['bag','Pack school supplies','Find your school bag.|Check one thing at a time with a grown-up.',false],['leave','Shoes, coat, and ready to go','Bring your shoes to the door.|Ask for help with the next leaving step.',true]]},
    afternoon:{title:'After-School Reset',steps:[['recharge','Snack and decompress','Find a quiet, comfortable spot.|Choose a snack, drink, or a little quiet time.',true],['unpack','Put school things away','Put your bag in its home.|Take out just one thing that needs attention.',false],['transition','Check the homework plan','Ask what one small thing is next.|Choose a short break before you begin.',false],['play','Enjoy a little independent play','Choose one toy or activity you like.|A grown-up can help you get started.',true],['feelings','Check in with your feelings','Notice how your body feels.|Point to a feeling or tell a trusted grown-up.',false]]},
    learning:{title:'Learning Adventure',steps:[['reading','Read or listen to a story','Choose a book, audiobook, or someone to read with.|Try one page or a few minutes. Listening counts.',true],['math','Try a little math','Choose one small question.|Use objects or ask someone to do it with you.',false],['schoolwork','Try a little schoolwork','Get out one assignment or practice activity.|Try one small part, with help if you want.',true]]},
    evening:{title:'Evening Adventure',steps:[['bath','Bath or wash time','Get your towel and cozy things.|Ask for help getting the water ready.',true],['pajamas','Pajamas and hair','Choose your cozy pajamas.|Try one part, then ask for help if needed.',true],['teeth','Teeth and bathroom','Go to the bathroom and find your toothbrush.|Ask a grown-up to help you get started.',true],['story','Read or listen to a bedtime story','Choose a comforting story.|Read, listen, or share a page together.',true],['comfort','Cozy family time','Keep the comforting habit your family has planned.|Ask what the next gentle transition will be.',false],['settle','Optional: get cozy in your own bed','Bring a comfort item to your bed.|Practice getting cozy with a grown-up nearby. Needing comfort is always okay.',false]]}
  };
  function create(data,today){
    const sup=data.support;
    if(sup.adventures?.version>1)throw new Error('This save needs a newer routine version. Your progress has not been changed.');
    let importOldHomework=!sup.adventures;
    const key=(group,index)=>group==='learning'&&index===0||group==='evening'&&index===3?'reading':group+':'+groups[group].steps[index][0];
    const valid=(group,index)=>Boolean(groups[group]&&Number.isInteger(index)&&groups[group].steps[index]);
    function ensureDay(){
      const day=today();let changed=false;
      if(sup.day!==day){sup.day=day;sup.done={};changed=true;}
      if(!sup.adventures||sup.adventures.day!==day){sup.adventures={version:1,day,claims:{},postponed:{}};changed=true;}
      const state=sup.adventures;
      // Import existing completions without granting or subtracting any currency.
      for(const [group,r] of Object.entries(groups))r.steps.forEach((_,i)=>{if(sup.done[group+':'+i])state.claims[key(group,i)]=true;});
      if(!state.imported){
        const legacy=data.lastDay===day?(data.completed||[]):[];
        const claimGroup=g=>groups[g].steps.forEach((_,i)=>{state.claims[key(g,i)]=true;});
        if(legacy.includes('morning'))claimGroup('morning');
        if(legacy.includes('bedtime'))claimGroup('evening');
        if(legacy.includes('reading'))state.claims.reading=true;
        if(legacy.includes('school')||(importOldHomework&&sup.homework?.some(h=>h.done)))state.claims['learning:schoolwork']=true;
        state.imported=true;importOldHomework=false;changed=true;
      }
      if(data.lastDay!==day){data.lastDay=day;data.completed=[];changed=true;}
      return changed;
    }
    ensureDay();
    const state=()=>sup.adventures;
    const done=(g,i)=>Boolean(state().claims[key(g,i)]);
    const visible=g=>groups[g].steps.map((step,i)=>({id:step[0],name:step[1],hints:step[2].split('|'),essential:step[3],i,key:key(g,i)})).filter(s=>!sup.hard||s.essential);
    function complete(g,i){
      ensureDay();if(!valid(g,i)||done(g,i))return false;
      const claim=key(g,i);state().claims[claim]=true;delete state().postponed[claim];
      // Keep legacy done fields in sync, including the shared reading aliases.
      for(const [group,r] of Object.entries(groups))r.steps.forEach((_,n)=>{if(key(group,n)===claim)sup.done[group+':'+n]=true;});
      data.stars+=5;
      if(claim==='reading'){sup.reading++;if(sup.reading%3===0)sup.keys++;}
      if(g==='evening'&&i===5)sup.dream++;
      return true;
    }
    function postpone(g,i){ensureDay();if(!valid(g,i)||done(g,i))return false;const k=key(g,i);state().postponed[k]=!state().postponed[k];return true;}
    function next(hour){
      ensureDay();const preferred=hour<11?'morning':hour<15?'learning':hour<19?'afternoon':'evening';
      const order=[preferred,...Object.keys(groups).filter(g=>g!==preferred)];
      for(const g of order){const step=visible(g).find(s=>!done(g,s.i)&&!state().postponed[s.key]);if(step)return {group:g,...step};}
      return null;
    }
    function progress(g){const list=g?visible(g):Object.keys(groups).flatMap(visible);const unique=[...new Map(list.map(s=>[s.key,s])).values()];return {done:unique.filter(s=>state().claims[s.key]).length,total:unique.length};}
    return {groups,key,valid,ensureDay,done,visible,complete,postpone,next,progress,state};
  }
  root.AdventureModel={create,groups};
  if(typeof module!=='undefined')module.exports=root.AdventureModel;
})(typeof window!=='undefined'?window:globalThis);
