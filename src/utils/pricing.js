import {basePrice,findOption} from '../data/productData';
export const priceFor=config=>basePrice+['color','material','sole','laces','hardware'].reduce((sum,key)=>sum+(findOption(key,config[key])?.[2]||0),0)+config.addons.reduce((sum,id)=>sum+(findOption('addons',id)?.[2]||0),0);
export const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
