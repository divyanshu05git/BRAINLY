export function random(len:number){
    let opt="qwertyuiopasdfghjklzxcvbnm1234567890";
    let ans="";

    for(let i=0;i<len;i++){
        ans+=opt[Math.floor(Math.random()*opt.length)]
    }

    return ans;
}