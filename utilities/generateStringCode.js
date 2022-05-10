module.exports = (
    length=30,
    chars="abcdefghijklmnopqrstuvwxyz1234567890"
)=>{
    const charactersLength = length;
    let result = "";

    for(let i=0;i<charactersLength;i++){
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }

    return `${result}`;
}