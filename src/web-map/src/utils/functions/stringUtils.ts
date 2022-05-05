
export const capitalize =(p:string)=>{
    if(!p) return '';
    return p.charAt(0).toUpperCase() + p.slice(1)
}
