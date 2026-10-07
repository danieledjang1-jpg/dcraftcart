export const basePrice = 120;
export const options = {
  color:[['obsidian','Obsidian',0,'#172033'],['cloud','Cloud White',0,'#f6f7f4'],['royal','Royal Blue',8,'#2563eb'],['forest','Forest',8,'#18704b'],['crimson','Crimson',10,'#c92d45']],
  material:[['mesh','Standard Mesh',0],['leather','Premium Leather',35],['suede','Suede',45],['carbon','Carbon Fiber',55]],
  sole:[['classic','Classic',0],['performance','Performance',25],['air','Air Cushion',40]],
  laces:[['classic','Classic',0],['reflective','Reflective',12],['premium','Premium',18]],
  hardware:[['standard','Standard',0],['metallic','Metallic',15],['titanium','Titanium',30]],
  addons:[['name','Custom Name',20],['extra','Extra Laces',10],['gift','Gift Box',12],['care','Care Kit',15],['express','Express Production',25]]
};
export const defaults={color:'obsidian',material:'mesh',sole:'classic',laces:'classic',hardware:'standard',addons:[]};
export const findOption=(category,id)=>options[category].find(o=>o[0]===id);
export const label=(category,id)=>findOption(category,id)?.[1]||'—';
