const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTab(tabs[n]);tabs[n].focus();}});});
document.querySelectorAll('[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('main-product-image').src=btn.dataset.gallery;document.querySelectorAll('[data-gallery]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));}));
const search=document.getElementById('product-search'),filter=document.getElementById('category-filter');
const catalogCards=[...document.querySelectorAll('[data-product]')];
function renderProducts(){const terms=(search?.value||'').trim().toLowerCase().split(/\s+/).filter(Boolean);const matches=catalogCards.filter(card=>terms.every(term=>card.dataset.product.includes(term))&&(!filter?.value||card.dataset.category===filter.value));catalogCards.forEach(card=>card.hidden=!matches.includes(card));const result=document.getElementById('result-count');if(result)result.textContent=`${matches.length} packaging styles`;const empty=document.getElementById('empty-state');if(empty)empty.hidden=matches.length!==0;}
function filterProducts(){renderProducts();}
search?.addEventListener('input',filterProducts);filter?.addEventListener('change',filterProducts);
if(catalogCards.length)renderProducts();
const form=document.getElementById('inquiry-form');
if(form){const params=new URLSearchParams(location.search);const product=form.elements.namedItem('Product / box style'),selected=(params.get('product')||'').slice(0,200);if(selected){product.add(new Option(selected,selected));product.value=selected;}let brief='';form.addEventListener('input',()=>{document.getElementById('brief-panel').hidden=true;});const status=document.getElementById('form-status'),file=form.elements.namedItem('attachment'),submit=form.querySelector('[type=submit]');
const uploadZone=document.getElementById('upload-zone'),fileName=document.getElementById('file-name');
const attachmentList=document.createElement('div');attachmentList.className='attachment-list';uploadZone.closest('label').after(attachmentList);let attachments=[];
function renderAttachments(){
 const transfer=new DataTransfer();attachments.forEach(item=>transfer.items.add(item.file));file.files=transfer.files;attachmentList.replaceChildren();
 attachments.forEach((item,index)=>{const card=document.createElement('div');card.className='attachment-item';if(item.url){const image=document.createElement('img');image.className='attachment-preview';image.alt=item.file.name;image.src=item.url;image.addEventListener('error',()=>{image.hidden=true;});card.append(image);}const name=document.createElement('span');name.textContent=item.file.name+' · '+(item.file.size/1024/1024).toFixed(2)+' MB';const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+item.file.name);remove.addEventListener('click',()=>{if(item.url)URL.revokeObjectURL(item.url);attachments.splice(index,1);renderAttachments();});card.append(name,remove);attachmentList.append(card);});
 fileName.textContent=attachments.length?attachments.length+' files selected · Add more anytime':'No files selected';document.getElementById('brief-panel').hidden=true;
}
function addAttachments(incoming){const errors=[];for(const f of incoming){if(f.size>10*1024*1024){errors.push(f.name+': exceeds 10 MB');continue;}if(!/\.(png|jpe?g|pdf|ai)$/i.test(f.name)){errors.push(f.name+': unsupported format');continue;}if(attachments.some(item=>item.file.name===f.name&&item.file.size===f.size&&item.file.lastModified===f.lastModified))continue;attachments.push({file:f,url:/\.(png|jpe?g)$/i.test(f.name)?URL.createObjectURL(f):''});}renderAttachments();uploadZone.classList.toggle('invalid',errors.length>0);if(errors.length)fileName.textContent+=' · Not added: '+errors.join('; ');}
file.addEventListener('change',()=>addAttachments([...file.files]));
['dragenter','dragover'].forEach(type=>uploadZone.addEventListener(type,event=>{event.preventDefault();uploadZone.classList.add('dragging');}));
uploadZone.addEventListener('dragleave',event=>{if(!uploadZone.contains(event.relatedTarget))uploadZone.classList.remove('dragging');});
uploadZone.addEventListener('drop',event=>{event.preventDefault();uploadZone.classList.remove('dragging');addAttachments([...event.dataTransfer.files]);});
form.addEventListener('reset',()=>{attachments.forEach(item=>{if(item.url)URL.revokeObjectURL(item.url);});attachments=[];renderAttachments();uploadZone.classList.remove('invalid','dragging');});
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity()||submit.disabled)return;
const endpoint=form.dataset.formspreeEndpoint;
if(endpoint){
 if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)){status.textContent='Online submission is unavailable. Please contact us by email or WhatsApp.';return;}
 submit.disabled=true;status.textContent='Sending your inquiry…';
  try{const response=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Submission failed');status.textContent='Thank you. Your inquiry has been submitted successfully.';if(typeof gtag==='function'){gtag('event','generate_lead',{form_id:form.id||'inquiry-form',page_location:location.href});}form.reset();document.getElementById('brief-panel').hidden=true;}
 catch{status.textContent='We could not confirm your submission. Your details are still here. Please try again or contact us by email or WhatsApp.';}
 finally{submit.disabled=false;}return;
}
status.textContent='Your inquiry has not been sent. Use email or WhatsApp below; attach your file in that conversation.';
brief='ArtfulPack — packaging project inquiry\n\n'+[...new FormData(form)].filter(([k])=>k!=='consent'&&k!=='attachment').filter(([,v])=>String(v).trim()).map(([k,v])=>`${k}: ${String(v).trim()}`).join('\n');document.getElementById('brief-text').textContent=brief;document.getElementById('email-brief').href='mailto:lilychung@artfulpackages.com?subject='+encodeURIComponent('Custom packaging inquiry — '+form.elements.namedItem('Company').value)+'&body='+encodeURIComponent(brief);document.getElementById('whatsapp-brief').href='https://wa.me/8618974439121?text='+encodeURIComponent(brief);const panel=document.getElementById('brief-panel');panel.hidden=false;panel.focus();panel.scrollIntoView({block:'nearest',behavior:'smooth'});});document.getElementById('copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief);document.getElementById('copy-status').textContent='Inquiry copied. Paste it into your preferred email or chat app.';}catch{document.getElementById('copy-status').textContent='Copy is unavailable here. Select the text above or download your brief.';}});document.getElementById('download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ArtfulPack-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});}
if(form) document.getElementById('inquiry-fields').disabled=false;
const productMenu=document.querySelector('.product-menu');
if(productMenu){
  const summary=productMenu.querySelector('summary');let openedByHover=false;
  productMenu.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&matchMedia('(min-width:761px) and (hover:hover)').matches&&!productMenu.open){productMenu.open=true;openedByHover=true;}});
  summary.addEventListener('click',event=>{if(openedByHover){event.preventDefault();openedByHover=false;}});
  productMenu.addEventListener('pointerleave',event=>{openedByHover=false;if(event.pointerType==='mouse'&&!productMenu.contains(document.activeElement))productMenu.open=false;});
  productMenu.addEventListener('focusout',event=>{if(!productMenu.contains(event.relatedTarget)){productMenu.open=false;openedByHover=false;}});
  document.addEventListener('click',event=>{if(!productMenu.contains(event.target)){productMenu.open=false;openedByHover=false;}});
  productMenu.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();productMenu.open=false;openedByHover=false;summary.focus();}});
  menu?.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='false'){productMenu.open=false;openedByHover=false;}});
}

// Factory photo selection.
const factoryOptions=document.querySelector('.factory-options');
if(factoryOptions){
  factoryOptions.querySelectorAll('.factory-thumb').forEach(button=>{
    const selectPhoto=()=>{
    factoryOptions.querySelectorAll('.factory-thumb').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const image=button.querySelector('.factory-tile-image');
    const featured=factoryOptions.querySelector('.factory-featured');
    featured.querySelector('.factory-tile-image').setAttribute('style',image.getAttribute('style'));
    featured.querySelector('.factory-tile-image').setAttribute('aria-label',image.getAttribute('aria-label'));
    featured.querySelector('figcaption').textContent=button.querySelector('span').textContent;
    };
    button.addEventListener('mouseenter',selectPhoto);
    button.addEventListener('focus',selectPhoto);
    button.addEventListener('click',selectPhoto);
  });
}
