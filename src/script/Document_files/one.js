let res=[]
localStorage.removeItem('tikk')
for(let i=0;i<15000;i++){
    let data={
        name:'product name hai 1',
        details:'ye details hain',
        contactName:'Ye Shop name hain jo bara hai',
        gstno:465465464645465464545,
        id:new Date().getTime(),
        rate:15466456.54,
        qty:5464654,
        used:56465,
        createdBy:'Raudhan dkumar singh',
        createdAt:54665465465465465,
        remarks:'heko oaasdhflkj jhadjfjh ajdfhfj ajfdjdfa adfkdfkh'
    }
    res.push(data)
}
localStorage.tikk=JSON.stringify(res)
let result=JSON.parse(localStorage.tikk)