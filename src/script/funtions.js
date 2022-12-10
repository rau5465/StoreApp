function tf(text){
    let res=text.replaceAll('"','&quot;')
    return res;
}


let req={
    clear:function(){
        localStorage.removeItem('requirement')
    },
    save:function(e){
        localStorage.requirement=JSON.stringify(e)
    },
    get:function(){
        let res=[]
        if(localStorage.requirement){
            res=JSON.parse(localStorage.requirement)
        }
        return res.reverse()
       
    },
    update:function(id,key,val){
        let data=this.get()
        let res=data.find(c=>c._id==id)
        const index=data.indexOf(res)
        res[key]=val
        data[index]=res
        this.save(data)
    }
    ,
    add:function(e){
        let data=this.get()
        let res=data.find(c=>c._id==e._id)
        if(res){
            say(0,`Product is already present in the requirement list`)
            return
        }
        data.push(e)
        this.save(data)
        return data
    },
    remove:function(e){
        let data=this.get()
       data=data.filter(c=>c._id!=e)
        this.save(data)
        return data
    }
}
deleteCont2=0
setInterval(()=>{
    deleteCont=0
    deleteCont2=0
},3000)

function requirementCreated(e){
    say(1,'Requirement Created')
    req.clear()
    $("#prlist").empty()
    $('.rq').val('')
    printProduct()
    if(!allRequirements){
        REQUIREMENTS.get();
        return
    }
    allRequirements=[e, ...allRequirements]
    filterReqHisCategory()
}
function reqListDelete(){
    deleteCont2++;
    if(deleteCont2 < 2){
        say(3,'Click again to delete requirement')
        return
    }
    deleteCont2=0
    const id=$("#reqlist").val()
    REQUIREMENTS.delete(id)
}

function say(type,message,interval,delay){
    if(!delay){
        delay=0;
    }
    if(!interval){
        interval=3000
    }
    let color='green'
    if(type==0){
        color='red'
    }
    if(type==2){
        color='skyblue'
    }
    if(type==3){
        color='orangered'
    }
    setTimeout(()=>{
        $("#alert").css('background-color',color).css('display','block')
        $("#alert").html(message)
        setTimeout(()=>{
            $("#alert").css('display','none')
        },interval)
    },delay)
   
}

function gotAllProduct(data){
    allProducts=data;
    printProduct()
}

function gotAllUser(e){
    allUsers=e;
}
function printProduct(filterText,filterCategory,filterQty){
    $('#plist').empty()
    $('#productLists').empty()
    $('#productReqLists').empty()
    $('#reqProductList').empty()
    const len=allProducts.length
    $('#productsInStore').html(`Total Products: ${len}`)
    let requirement=req.get()
    const cat=$('#productListFilter').val()
    allProducts.map((c,i)=>{
        $('#productLists').append(`<option value="${tf(c.productName)}">`)
        $('#reqProductList').append(`<option value="${tf(c.productName)}">`)
       // $('#productReqLists').append(`<option value="${c.productName}">${c.productName}</option>`)
       let rq=requirement.find(p=>c._id==p._id)
        let dt=false;
        if(filterText){
            dt=c.details ? c.details.toLowerCase().includes(filterText.toLowerCase()):false;
        }
        if(filterText && !c.productName.toLowerCase().includes(filterText.toLowerCase()) && !c.category.toLowerCase().includes(filterText.toLowerCase()) && !dt){
            return
        }
        if(filterCategory && c.category!=filterCategory){
            return
        }
        if(filterQty && filterQty < c.qty){
            return
        }
        if(cat && !c.category.toLowerCase().includes(cat.toLowerCase())) return
        let val='';
        if(c.qty && c.rate){
            val=parseFloat(c.qty)*parseFloat(c.rate)
            val=parseFloat(val).toFixed(2)
        }

        $('#plist').append(`
        <tr id="l-${c._id}" class=" ${rq?'less':''}" >
        <td>${i+1}</td>
        <td><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-0-productName" value="${tf(c.productName)}" ></td>
        <td><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-1-category"  value="${c.category}" ></td>
        <td><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-2-details" value="${c.details?c.details:''}" ></td>
        <td style="width:8%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-3-rate" value="${c.rate?c.rate:0}" ></td>
        <td style="width:8%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-4-size" value="${c.size?c.size:''}" ></td>
        <td style="width:7%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-5-qty" value="${c.qty?c.qty:0}${c.qtys?' '+c.qtys:''}" ></td>
        <td style="width:8%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-6-val" value="${val}" ></td>
        <td style="width:7%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-7-used" value="${c.used ? c.used:0}"></td>
        <td style="width:12%;"><input type="text" ${user.role==1?'disabled':''} class="product${i}" data-id="${c._id}" key="${i}-8-contactName" value="${c.contactName?c.contactName:''}" ></td>
        <td>
          <div style="display: flex;justify-content: center;align-items: center;">
            <label class="bd ${rq?'red':'green'} ${user.role==1?'d-none':''}" style="margin-right:5px;" key="req-${c._id}" data-toggle="tooltip" data-placement="top" title="Add Or Remove From Requirement">${rq?'-':'+'}</label>
            <label class="delete text-danger tolltip" data-msg="Save Product" onclick="deleteProduct('${c._id}')">&times;</label>
          </div>
        </td>
      </tr>
        `)
    })
}

function productUpdated(e){
 say(1,'Product updated',1000)
}

function restoreEntry(){
    ENTRIES.restore(currentEntryId)
}

function productChange(e){
    const i=e.split('-')[0]
    const n=e.split('-')[1]
    const key=e.split('-')[2]
    let data={}
    if(key==`qty`){
        let txt=$('.product'+i)[n].value;
        data[key]=parseFloat(txt)
        data['qtys']=txt.replace(/[\W\d_]/g, '');
    }else{
        data[key]=$('.product'+i)[n].value
    }
    let id=$('.product'+i)[n].getAttribute('data-id')
    PRODUCTS.update(id,data)
}

$('#plist').change(function(e){
    const key=e.target.getAttribute('key')
    productChange(key)
  })
let totalReqCost=0;


  $('#prlist').change(function(e){
    const key=e.target.getAttribute('key')
    const cat=$('#productReqCategoryFilter').val()
    let reql=req.get()
    const i=key.split('-')[0]
    const n=key.split('-')[1]
    const key2=key.split('-')[2]
    let data={}
    let q=e.target.value
    let id=$('.productr'+i)[parseInt(n)].getAttribute('data-id')
    let p=reql.find(c=>c._id==id)
    if(!p){
        p=allProducts.find(c=>c._id==id)
    }
    data[key2]=q
    data['_id']=id
    try{
        if(key2=='loc'){
            req.update(id,'loc',q)
        }
        if(key2=='rate'){
            req.update(id,'rate',q)
            reql=req.get()
            const pr=reql.find(c=>c._id==id)
            if(pr.req){
                let cost=parseFloat(pr.rate)*parseFloat(pr.req)
                $('.productr'+i)[5].innerText=cost?parseFloat(cost).toFixed(2):''
            }
        }
        if(p.rate && key2=='req'){
            req.update(id,'req',parseFloat(q))
            let cost=parseFloat(q)*parseFloat(p.rate)
            $('.productr'+i)[5].innerText=cost?parseFloat(cost).toFixed(2):''
        }
        if(key2=='remarks'){
            req.update(id,'remarks',q)
        }
    }catch{}
    culculateTotalReqCost()
   
  })
  function culculateTotalReqCost(){
    let totalCost=0;
    const reql=req.get()
    reql.map(c=>{
        if(c.rate && c.req){
            const cost=parseFloat(parseFloat(c.rate)*parseFloat(c.req))
            totalCost +=cost
        }
    })
    $("#reqCost").val(totalCost)
  }

  function productDeleted(){
    gotAllProduct(allProducts)
  }

  $('#plist').click(function(e){
    const key=e.target.getAttribute('key')
  if(key && key.includes(`req`)){
    const id=key.split('-')[1];
    const data=req.get();
    const res=data.filter(c=>c._id==id)
    const el=e.target
    let d=allProducts.find(c=>c._id==id)
    if(res.length >0){
        req.remove(id)
        el.innerHTML='+'
        el.classList.remove('red')
        el.classList.add('green')
        $("#l-"+id).removeClass('less')
    }else{
        req.add(d)
        el.innerHTML='-'
        el.classList.remove('green')
        el.classList.add('red')
        $("#l-"+id).addClass('less')
    }
  }
  })

  function filterReqCategory(){
    // const key=$("#productReqCategoryFilter").val()
    // printProductReq(key)
  }

  function printProductReq(filterText,filterCategory,filterQty){
    $('#prlist').empty()
    const len=allProducts.length
    let rq=req.get()
    const requirement=req.get();
    rq.map((c,i)=>{
       
        let dt=false;
        if(filterText){
            dt=c.details ? c.details.toLowerCase().includes(filterText.toLowerCase()):false;
        }
        if(filterText && !c.productName.toLowerCase().includes(filterText.toLowerCase()) && !c.category.toLowerCase().includes(filterText.toLowerCase()) && !dt){
            return
        }
        if(filterCategory && c.category!=filterCategory){
            return
        }
        if(filterQty && filterQty < c.qty){
            return
        }
       
        let m=c.req?c.req:0;
        let r=c.rate?c.rate:0;
        let val=parseFloat(m)*parseFloat(r)
        val=parseFloat(val.toFixed(2))
        $('#prlist').append(`
        <tr id="l-${c._id}" class=" ${requirement.includes(c._id)?'less':''}" >
        <td>${i+1}</td>
        <td style="width:14vw;" class="productr${i}" data-id="${c._id}" key="${i}-0-productName">${tf(c.productName)}</td>
        <td class="productr${i}" data-id="${c._id}" key="${i}-1-category">${c.category}</td>
        <td style="width:10vw;"><input type="text" class="productr${i}" data-id="${c._id}" key="${i}-2-rate" value="${c.rate?c.rate:''}"></td>
        <td class="productr${i}" data-id="${c._id}" key="${i}-3-qty" >${c.qty?c.qty:''}</td>
        <td style="width:10vw;"><input type="text" class="productr${i}" data-id="${c._id}" key="${i}-4-req" value="${c.req?c.req:''}"></td>
        <td class="productr${i}" data-id="${c._id}" key="${i}-5-val" >${val==0?'':val}</td>
        <td style="width:8vw;"><input type="text" class="productr${i}" data-id="${c._id}" key="${i}-6-loc" value="${c.loc?c.loc:''}" ></td>
        <td><input type="text" class="productr${i}" data-id="${c._id}" key="${i}-7-remarks" value="${c.remarks?c.remarks:''}" ></td>
        <td>
          <div style="display: flex;justify-content: center;align-items: center;">
            <label class="delete text-danger tolltip" data-msg="Save Product" onclick="deleteProductReq('${c._id}')">&times;</label>
          </div>
        </td>
      </tr>
        `)
    })
    culculateTotalReqCost()
}


function deleteProductReq(e){
    let data=req.get()
    data=data.filter(c=>c._id!=e)
    req.save(data)
    printProductReq()
}



function deleteProduct(id){
    if(user.role==1){
        say(0,'You do not have permission to delete')
        return
    }
    deleteCont++;
    if(deleteCont<2){
        say(3,'Click 2 times quickly to confirm')
        return
    }
    PRODUCTS.delete(id)
    printProduct()
    say(1,'Product Deleted')
}

function productCreated(data){
    allProducts=[data,...allProducts]
    if(pendingEntryProductUpdate){
        updateEntryList()
    }
    say(1,'Product Created')
    printProduct()
}
function createProduct(){
    let data={
        productName:$('#productName').val(),
        details:$('#productDetails').val(),
        qty:$('#productQty').val(),
        rate:$('#productRate').val(),
        category:$('#productCategory').val(),
        size:$('#productSize').val(),
        createdBy:user.name
    }
    if(!data.productName || !data.qty || !data.category){
        say(0,'Mendetory Fields are empty')
        return
    }
   PRODUCTS.add(data)
}

function gotAllCategory(){
    $('#productCategory').empty();
    $('#productCategorydataList').empty();
    $('#productListFilter').empty();
    $('#categoryListMain').empty();
    $('#productReqListFilter').empty();
    $('#productReqHisCategoryFilter').empty();
    $('#productListFilter').append(` <option value="">All</option>`)
    $('#productCategory').append(` <option value="">All</option>`)
    $('#productReqCategoryFilter').append(`<option value="">All</option>`)
    $('#productReqHisCategoryFilter').append(` <option value=''>All</option>`)
    allCategory.map((c,i)=>{
        $('#productCategorydataList').append(`<option value="${c.name}">`)
        $('#productListFilter').append(` <option value="${c.name}">${c.name}</option>`)
        $('#productCategory').append(` <option value="${c.name}">${c.name}</option>`)
        $('#productReqCategoryFilter').append(` <option value="${c.name}">${c.name}</option>`)
        $('#productReqHisCategoryFilter').append(` <option value="${c.name}">${c.name}</option>`)
        $('#categoryListMain').append(`
            <tr>
                <td>${i+1}</td>
                <td>${c.name}</td>
                <td>${c.details?c.details:''}</td>
                <td>
                  <div style="display: flex;justify-content: center;align-items: center;">
                      <label class="text-danger delete" style="font-size: 30px;line-height: 25px;" onclick="deleteCategory('${c.name}')">&times;</label>
                  </div>
                 
                </td>
            </tr>
        `)
    })
    try{
       $('#categoryName').val('')
       $('#categoryDetails').val('')
    }catch{}
}

function gotAllEntry(){
    const type=$('#allEntryTypeFilter').val()
    productEntryDateFilter()
    printAllEntry(type)
}

$('#productListFilter').change(function(){
    printProduct(null,$('#productListFilter').val())
})

function productQtyFilterSearch(){
    printProduct(null,null,parseInt($('#productQtyFilterSearch').val()))
}
function productSearch(){
    printProduct($('#productSearch').val())
}

//category Code

function deleteCategory(name){
    if(user.role==1){
        say(0,'You do not have permission to delete')
        return
    }
    CATEGORIES.delete(name)
}
function categoryCreated(e){
    allCategory=[e,...allCategory]
    gotAllCategory()
}
function newCategory(){
    if(!$('#categoryName').val()){
        say('Category name is empty')
        return
    }
let data={
    name:$('#categoryName').val(),
    details:$('#categoryDetails').val()
}
CATEGORIES.add(data)
}


//supplier Code
function gotAllContact(){
   printContact()
    try{
        $('#contactForm').val('');
    }catch{}
}
$('#entryContacts').change(function(){
   
})

function contactChange(){
    const name=$('#entryContacts').val()
    let data=allContact.find(c=>c.name==name)
    if(!data){
        $('.newContact').show()
    }else{
        $('.newContact').hide()
    }
    $('#entryContactGstno').val(data.gstno ? data.gstno:'')

}
$("#contactList").change(function(e){
    const key=e.target.getAttribute('key')
    changeContactBack(key)
})

function printContact(filtertext){
    $('#contactList').empty()
    $('#contactLists').empty()
    $('#entryContacts').empty()
    $('#contactCont').text('Total Suppliers: '+allContact.length)
    $('#entryContacts').append(`
    <option value="" disabled selected>Select</option>
    `)
    allContact.map((c,i)=>{
        $('#entryContacts').append(`                
        <option value="${c._id}">${c.name}</option>
        `)
        $('#contactLists').append(`                
        <option value="${c.name}">
        `)
        if(filtertext){
            let nt=c.name.toLowerCase().includes(filtertext.toLowerCase())
            let gt=c.gstno ? c.gstno.includes(filtertext):false;
            let pt=c.contactPerson ? c.contactPerson.toLowerCase().includes(filtertext.toLowerCase()):false;
            let mt=c.mobile ? c.mobile.includes(filtertext):false;
            let et=c.email ? c.email.includes(filtertext.toLowerCase()):false      
            let at=c.address ? c.address.includes(filtertext.toLowerCase()):false      
            if(!(nt || gt || pt || mt || et || at)){
                 return
            }
        }
        $('#contactList').append(`
        <tr>
                  <td style="cursor: pointer;">${i+1}</td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-0-name" value="${c.name}" class="wb" ></td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-1-contactPerson" value="${c.contactPerson?c.contactPerson:''}" class="wb"></td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-2-gstno" value="${c.gstno?c.gstno:''}" class="wb"></td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-3-email" value="${c.email?c.email:''}" class="wb"></td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-4-mobile" value="${c.mobile?c.mobile:''}" class="wb"></td>
                  <td><input type="text" ${user.role==1?'disabled':''} class="contact${i}" data-id="${c._id}" key="${i}-5-address" value="${c.address?c.address:''}" class="wb"></td>
                  <td>
                    <div style="display: flex;justify-content: center;align-items: center;">
                        <label class="text-danger delete" style="font-size: 30px;line-height: 25px;" onclick="deleteContact('${c._id}')">&times;</label>
                    </div>
                  </td>
                </tr>
        `)
    })
}


function deleteContact(id){
    if(user.role==1){
        say(0,'You do not have permission to delete')
        return
    }
    CONTACTS.delete(id)
}


function contactCreated(e){
    allContact=[e,...allContact]
    gotAllContact()
}
function newContact(){
    if(!$('#contactName').val()){
        say(0,'Contact name is empty')
        return
    }
let data={
    name:$('#contactName').val(),
    contactPerson:$('#contactPersonName').val(),
    email:$('#contactEmail').val(),
    mobile:$('#contactMobile').val(),
    address:$('#contactAddress').val(),
    gstno:$('#contactGstno').val(),
}

CONTACTS.add(data)
contactCreated()
}


let updateIndex=0

function contactUpdated(e){
allContact.map((c,i)=>{
if(c._id==e._id){
    allContact[i]=e
}
})
}


function changeContactBack(e){
    let i=parseInt(e.split('-')[0])
    let n=parseInt(e.split('-')[1])
    let key=e.split('-')[2]
    $(`.contact`+i)[n].style.backgroundColor='lightGray'
    let id=$('.contact'+i)[n].getAttribute('data-id')
    let data={}
    data[key]=$('.contact'+i)[n].value
    CONTACTS.update(id,data)
}

function contactSearch(){
   let key=$('#contactSearch').val()
 
   printContact(key)
}

let entryProduct={}
let entryProducts=[]
let newEntry={}
// entry code

function allPurchagePage(){
    ENTRIES.get()
    
    $(".screen").hide()
    $("#allEntry").show()
    
}

function filterEntryType(){
    const type=$('#allEntryTypeFilter').val()
    const type2=$('#entryGroup').val()
    if(type2=='Single'){

        return
    }
   
    printAllEntry(type)
    
}
function seachEntry(){
    const type=$('#allEntryTypeFilter').val()
    const key=$('#searchEnt').val()
    const type2=$('#entryGroup').val()
    if(type2=='Single'){
        filterEntryGroupType(key.toLowerCase())
        return
    }
    printAllEntry(type,key)
}

function clearEntryFilter(){
   $("#entryFromDate").val('')
$("#entryToDate").val('')
$("#entryGroup").val('Group')

const type=$('#allEntryTypeFilter').val()
printAllEntry(type)
}

function searchEntryByDate(){
    const type=$('#allEntryTypeFilter').val()
    const from=$("#entryFromDate").val()
    const to=$("#entryToDate").val()
    const type2=$('#entryGroup').val()
    const key=$('#searchEnt').val()
if(!from){
    return
}
if(type2=='Single'){
    filterEntryGroupType(key.toLowerCase())
    return
}
if(!to){
    return
}
printAllEntry(type,null,null,null,null,null,from,to)
}

function printAllEntry(type,key,contactName,billNumber,gstno,dated,from,to){
    const type2=$('#entryGroup').val()
    if(type2=='Single'){
        return
    }
    let data=allEntry.filter(c=>c.type==type)
    $("#entryListHead").empty()
    if(type=='recieved'){
        $("#entryListHead").append(`
            <tr>
               <th>Sn.</th>
               <th>Products</th>
               <th>Supplier/Shop</th>
               <th>GST No</th>
               <th>Bill No</th>
               <th>Total Cost</th>
               <th>Date</th>
               <th>Action</th>
              </tr>
        `)
    }else{
        $("#entryListHead").append(`
        <tr>
        <th>Sn.</th>
        <th>Products</th>
        <th>Remarks</th>
        <th>Total Cost</th>
        <th>Date</th>
        <th>Action</th>
       </tr>
        `)
    }
    let result=[]
    if(from && to){
        const bdate=new Date(from).getTime()
        const sdate=new Date(to).getTime()
        data.map(c=>{
            const date=new Date(c.dated).getTime()
            if(date >=bdate && date <=sdate){
                result.push(c);
            }
        })
        data=result;
    }
    if(key){
        data.map(c=>{
            if(c.contactName.toLowerCase().includes(key.toLowerCase()) || c.billNumber.toString().includes(key) || c.gstno.toString().includes(key) || c.dated.toString().includes(key)){
                result.push(c);
            }
        })
        data=result;
    }
    
    if(contactName){
        data=data.filter(c=>c.contactName==contactName)
    }
    if(billNumber){
        data=data.filter(c=>c.billNumber==billNumber)
    }
    if(gstno){
        data=data.filter(c=>c.gstno==gstno)
    }
    if(dated){
        data=data.filter(c=>c.dated==dated)
    }
    if(data.length==0){
        say(0,'No entry Found')
    }
    $("#entryMainList").empty()
   
    data.map((c,i)=>{
        let products=''
        let remarks=''
        const prod= c.products
        const len=prod.length
        let cont=0;
        prod.map((p,n)=>{
            cont++;
            products += `${p.productName}(${p.qty})${cont==len ?'':', '}`
            remarks +=`${p.remarks}${cont==len ?'':', '}`
        })
        let cost='';
        cost=c.totalCost;
        if(cost && cost=='NaN'){
            cost=''
        }
        if(type=='recieved'){
            $("#entryMainList").append(`
            <tr>
               <td style="width:2vw;font-size:0.7vw;">${i+1}</td>
               <td style="width:12vw;font-size:0.7vw;">${products}</td>
               <td style="width:12vw;font-size:0.7vw;">${c.contactName}</td>
               <td style="font-size:0.7vw;">${c.gstno}</td>
               <td style="font-size:0.7vw;">${c.billNumber}</td>
               <td style="font-size:0.7vw;">${cost}</td>
               <td style="font-size:0.7vw;">${c.dated}</td>
               <td>
                    <div style="display: flex;justify-content: center;align-items: center;">
                    <label style="font-size: 0.7vw;line-height: 20px;cursor: pointer;font-weight:bold;color:blue;" onclick="viewEntry('${c._id}')">Details</label>
                    </div>
               </td>
              </tr>
        `)
        }else{
            $("#entryMainList").append(`
            <tr>
                <td style="font-size:0.7vw;">${i+1}</td>
                <td style="font-size:0.7vw;">${products}</td>
                <td style="font-size:0.7vw;">${remarks}</td>
                <td style="font-size:0.7vw;">${cost}</td>
                <td style="font-size:0.7vw;">${c.dated}</td>
                <td style="font-size:0.7vw;">
                    <div style="display: flex;justify-content: center;align-items: center;">
                        <label style="font-size: 0.7vw;line-height: 20px;cursor: pointer;font-weight:bold;color:blue;" onclick="viewEntry('${c._id}')">Details</label>
                    </div>
                </td>
           </tr>
            `)
        }
    })
}

let currentEntryId=''

function deleteEntry(){
    ENTRIES.delete(currentEntryId)
}

function viewEntry(e){
    const entry=allEntry.find(c=>c._id==e)
    console.log(entry)
    currentEntryId=e
    $('#shopDetailTable').empty();
    $('#entryDetailTable').empty();
    $('#gstDetailTable').empty();

    if(entry.type=='recieved'){
        $('#entryDetailType').html('Bill Details')
        $('#gstDetailTable').append(`
                <tr>
                <td style="width: 80%;">IGST ${entry.igstr?'('+ entry.igstr +')':''}</td>
                <td>${entry.igst}</td>
            </tr>
            <tr>
            <td style="width: 80%;">CGST ${entry.cgstr?'('+ entry.cgstr +')':''}</td>

            <td>${entry.cgst}</td>
            </tr>
            <tr>
                <td style="width: 80%;">SGST ${entry.sgstr?'('+ entry.sgstr +')':''}</td>
                
                <td>${entry.sgst}</td>
            </tr>
            <tr>
                <td style="width: 80%;">Shipping Cost </td>
                
                <td>${entry.shippingCost}</td>
            </tr>
           
            <tr>
                <th style="width: 80%;">Total Cost</th>
                <th>${parseFloat(entry.totalCost).toFixed(2)}</th>
            </tr>
        `);
        $('#shopDetailTable').append(`
            <tr style="border-bottom: 1px solid black;">
                <th>Supplier/Shop</th>
                <th>${entry.contactName}</th>
            </tr>
            <tr>
                <td>GstNo</td>
                <td>${entry.gstno}</td>
            </tr>
            <tr>
            <td>BillNo</td>
            <td>${entry.billNumber}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>${entry.dated}</td>
            </tr>
        `);
        const prod=entry.products
        $('#entryDetailTable').append(`
        <thead>
        <tr style="border: 1px solid black;">
        <th>Sn.</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Gst</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody></tbody>
        `);
        prod.map((c,i)=>{
            $('#entryDetailTable tbody').append(`
            <tr>
            <td>${i+1}</td>
            <td>${c.productName}</td>
            <td>${c.qty}</td>
            <td>${c.rate?c.rate:''}</td>
            <td>${c.gst?c.gst:''}</td>
            <td>${c.cost?c.cost:''}</td>
           </tr>
        `);
        })
    }else{
        $('#entryDetailType').html('Store Expense Details')
        $('#gstDetailTable').append(`
                
            <tr>
                <th style="width: 80%;">Total Cost</th>
                <th>${parseFloat(entry.totalCost).toFixed(2)}</th>
            </tr>
        `);
        $('#shopDetailTable').append(`
            <tr>
                <td>Date</td>
                <td>${entry.dated} <span style="font-size:11px;font-weight:bold;cursor:pointer;color:blue;" onclick="showAllentry('${entry.dated}')" class="ph" data-toggle="tooltip" data-placement="top" title="Show All Ex. Entry From This Date">(All)</span></td>
            </tr>
        `);
        const prod=entry.products
        $('#entryDetailTable').append(`
        <thead>
        <tr style="border: 1px solid black;">
        <th>Sn.</th>
          <th>Product</th>
          <th>Qty Used</th>
          <th>Qty Avl.</th>
          <th>Rate</th>
          <th>Remarks</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody></tbody>
        `);
        prod.map((c,i)=>{
            const el=allProducts.find(p=>p.productName==c.productName)
            $('#entryDetailTable tbody').append(`
            <tr>
            <td>${i+1}</td>
            <td>${c.productName}</td>
            <td>${c.qty}</td>
            <td>${el.qty?el.qty:0}</td>
            <td>${c.rate?c.rate:''}</td>
            <td>${c.remarks?c.remarks:''}</td>
            <td>${c.cost?c.cost:''}</td>
           </tr>
        `);
        })
    
    }
    $('#entryDetails').show()
}

function showAllentry(e){
    const data=allEntry.filter(c=>c.dated==e && c.type!='recieved');
    
  let total=0
    $('#shopDetailTable').empty();
    $('#entryDetailTable').empty();
    $('#gstDetailTable').empty();
    
        $('#shopDetailTable').append(`
            <tr>
                <td>Date</td>
                <td>${e} </td>
            </tr>
        `);
        $('#entryDetailTable').append(`
        <thead>
        <tr style="border: 1px solid black;">
        <th>Sn.</th>
          <th>Product</th>
          <th>Qty Used</th>
          <th>Qty Avl.</th>
          <th>Rate</th>
          <th>Remarks</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        `);
        let i=0;
     data.map(c=>{

        const prod=c.products
       
         prod.map((c)=>{
            const pro=allProducts.find(p=>p.productName==c.productName)
             $('#entryDetailTable').append(`
             <tr>
             <td>${i+1}</td>
             <td>${c.productName}</td>
             <td>${c.qty}</td>
             <td>${pro.qty?pro.qty:0}</td>
             <td>${c.rate?c.rate:''}</td>
             <td>${c.remarks?c.remarks:''}</td>
             <td>${c.cost?c.cost:''}</td>
            </tr>
         `);
         total +=parseFloat(c.cost)
         i++;
         })
        
     })
     $('#entryDetailTable').append(`
     </tbody>
     `);
     let val=''
     if(total!='NaN'){
        val=total
     }
     $('#gstDetailTable').append(`
            <tr>
                <th style="width: 80%;">Total Cost</th>
                <th>${val?val.toFixed(2):''}</th>
            </tr>
        `);
    
}

function selectProductFromSearch(){
    const pname=$('#entryProductName').val();
    setProductOnEnty(pname);
}

function printEnteredProducts(){
$('#newEntryProductList').empty()

entryProducts.map((c,i)=>{
    let val=''
    let ke=''
    if(newEntry.type=='recieved'){
        val=c.gst?c.gst:''
        ke='gst'
    }else{
        val=c.remarks?c.remarks:''
        ke='remarks'
    }
  
    $('#newEntryProductList').append(`
            <tr>
              <td>${i+1}</td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-1-productName" value="${tf(c.productName)}" style="width:13vw;" ></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-2-details" value="${c.details ?c.details:''}" class="wb"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-4-qty" value="${c.avl}" class="wm"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-4-qty" value="${c.qty}" class="wm"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-5-rate" value="${c.rate}" class="wb"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-6-size" value="${c.size ?c.size:''}" class="wm"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-7-${ke}" value="${val}" class="ws"></td>
              <td><input disabled type="text" class="entryel${i}" data-key="${i}-8-cost" value="${c.cost}" class="ws"></td>
              <td>
                <div style="display: flex;justify-content: center;align-items: center;">
                  <label class="delete text-danger tolltip" onclick="removeFromEntryProductList('${c.productName}')">&times;</label>
                </div>
              </td>
            <tr>
    `)
})
entryProduct={}
}

function removeFromEntryProductList(e){
    entryProducts=entryProducts.filter(c=>c.productName!=e)
    printEnteredProducts()
}

function setProductOnEnty(e){
    entryProduct=allProducts.find(c=>c.productName==e)
    if(!entryProduct){
        return
    }
    $('#avlQty').html(`Qty: ${entryProduct.qty} Avl`)
    $('#entryProductDetails').val(entryProduct.details ? entryProduct.details :'')
    $('#entryProductCategory').val(entryProduct.category ? entryProduct.category :'')
    $('#entryProductRate').val(entryProduct.rate ? entryProduct.rate :'')
    $('#entryProductName').val(entryProduct.productName)
    $('#entryProductGst').val(entryProduct.gst ? entryProduct.gst :'')
    $('#productListToEntry').css('display','none')
}
let pendingEntryProductUpdate=false;

function saveProductToEntry(){
    const pname=$('#entryProductName').val()
    
    let product=allProducts.find(c=>c.productName==pname)
    const sname=$("#entryContacts").val()
    let contact=allContact.find(c=>c.name==sname)
    if($("#entryType").val()=='recieved'){
        if(!contact){
            let data={
                name:$('#entryContacts').val(),
                contactPerson:$('#entryContactPerson').val(),
                email:$('#entryContactEmail').val(),
                mobile:$('#entryContactMobile').val(),
                address:$('#entryContactAddress').val(),
                gstno:$('#entryContactGstno').val(),
            }
            if(!data.name){
                say(0,'Shop Name is missing')
                return
            }
            CONTACTS.add(data)
        }
        if(!product){
            let data={ 
                productName:pname,
                details:$('#entryProductDetails').val(),
                qty:0,
                qtys:'',
                rate:parseFloat($('#entryProductRate').val()),
                category:$('#entryProductCategory').val(),
                size:$('#entryProductSize').val(),
                contactName:$('#entryContacts').val(),
                createdBy:user.name
            }
            
            if(!data.productName  || !data.category){
                say(0,'Mendetory Fields are empty')
                return
            }
            pendingEntryProductUpdate=true;
            PRODUCTS.add(data)
        }else{
            updateEntryList()
        }
    }else{
        updateEntryList()
    }
}

function updateEntryList(){
    pendingEntryProductUpdate=false;
    let iqty=$('#entryProductQty').val()
    if(newEntry.type !='recieved'){
        if(parseFloat(iqty) >parseFloat(entryProduct.qty)){
            say(0,`You don't have ${iqty} Units`)
            return
        }
    } 

    const name=$('#entryProductName').val()
    let res=entryProducts.find(c=>c.productName==name)
    if(res){
        say(0,`Duplicate entry: Product already in list`)
        return
    }
    res=allProducts.find(c=>c.productName==name)
    if(!res){
        say(0,`Product Not Exists: Create Product first in product menu`)
        return
    }
    let rate=$('#entryProductRate').val();
    if(!rate){
        rate=0
    }
    entryProduct=res;
    entryProduct.avl=res.qty
    entryProduct.cost= $('#entryProductTotalCost').val()
    entryProduct.qty=iqty
    entryProduct.rate=rate
    entryProduct.qtys=iqty.replace(/[\W\d_]/g, '')
    entryProduct.remarks=$('#entryProductQty').val()
    if($('#entryProductRemarks').val()){
        entryProduct.remarks=$('#entryProductRemarks').val()
    }
    if($('#entryProductSize').val()){
        entryProduct.size=$('#entryProductSize').val()
    }
    if($('#entryProductGst').val()){
        entryProduct.gst=$('#entryProductGst').val()
    }
    entryProducts.push(entryProduct)
    $(".ep").val('')
    $('#avlQty').html(`Qty:`)
    printEnteredProducts()
    calculateTotalBillCost()
   
}

function culculateTotalProductCost(){
    let u=parseFloat($('#entryProductQty').val())
    let r=parseFloat($('#entryProductRate').val())
    if(!u){
        return
    }
    if(!r){
        return
    }
    $('#entryProductTotalCost').val(parseFloat(r*u).toFixed(2))
}
function calculateTotalBillCost(){
    let igst=$('#igst').val()
    igst=igst ? igst:0;
    let sgst=$('#sgst').val()
    sgst=sgst ? sgst:0;
    let cgst=$('#cgst').val()
    cgst=cgst ? cgst:0;
    let shippingCost=$('#shippingCharges').val()
    shippingCost=shippingCost ? shippingCost:0;
    let totalCost=0
    entryProducts.map(c=>{
        totalCost += parseFloat(c.cost)=='NaN'?0:parseFloat(c.cost);
    })
    totalCost +=parseFloat(igst)+parseFloat(cgst)+parseFloat(sgst)+parseFloat(shippingCost);
    if(totalCost.toString()=='NaN'){
        totalCost=0;
    }
    $("#totalBillCost").val(totalCost)
    return totalCost
}


function saveNewEntry(){
    let data={}
    const cname=$("#entryContacts").val();
    let thisContact=allContact.filter(c=>c.name==cname)[0]
    data.products=JSON.stringify(entryProducts)
    data.qty=entryProducts.length
    data.totalCost= $("#totalBillCost").val()
    data.dated=$("#entryDate").val();
    data.gstno=$("#entryContactGstno").val();
    data.details=$("#entryProductDetails").val();
    data.billNumber=$("#entryBillno").val()
    data.contactId=cname ? thisContact._id:''
    data.contactName=cname ? thisContact.name:''
    data.cgstr=$("#cgstr").val()
    data.cgst=$("#cgst").val()
    data.igst=$("#igst").val()
    data.igstr=$("#igstr").val()
    data.sgst=$("#sgst").val()
    data.sgstr=$("#sgstr").val()
    data.shippingCost=$("#shippingCharges").val()
    data.type=$("#entryType").val()
    if(data.totalCost=='NaN')
    {
        data.totalCost=0;
    }
    if(data.type=='recieved'){
        if(!data.billNumber){
            say(0,'Bill number is missing')
            return
        }
        if(!data.contactName){
            say(0,'Contact name is missing')
            return
        }
        if(!data.contactId){
            say(0,'Contact not exists')
            return
        }
        if(!data.dated){
            say(0,'Date is missing')
            return
        }
    }
    ENTRIES.add(data)
}

function entryDeleted(e){
    allEntry=allEntry.filter(c=>c._id!=e._id)
    productEntryDateFilter()
    gotAllEntry()
    $('#entryDetails').hide()
    PRODUCTS.get()
}



function entryCreated(data){
    say(1,'Entry Created')
    
    entryPostResult()
    if(!allEntry){
        ENTRIES.get();
        PRODUCTS.get()
        return;
    }
    allEntry=[data,...allEntry]
    productEntryDateFilter()
    PRODUCTS.get()
}

function entryPostResult(){
    entryProducts=[]
    $("#totalBillCost").val(0)
    $("#entryContacts").val('')
    $("#entryDate").val('')
    $("#entryContactGstno").val('')
    $("#entryProductDetails").val('')
    $("#entryBillno").val('')
    $("#cgstr").val(0)
    $("#cgst").val(0)
    $("#igst").val(0)
    $("#igstr").val(0)
    $("#sgst").val(0)
    $("#sgstr").val(0)
    $("#shippingCharges").val(0)
    $('#newEntryProductList').empty()
}

$('.forSupplier').hide()
$('.forExpense').show()


$('.nav-link').click(function(){
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
  })
 

  $('#user-name').html(user.name)
  function productPage(){
  $('.screen').hide()
  $('#product').show()
  if(allProducts.length <1){
    printProduct()
  }
  }
  function requirementPage(){
    REQUIREMENTS.get()
    $('.screen').hide()
  $('#requirement').show()
    printProductReq()
  }

  function categoryPage(){
  $('.screen').hide()
  $('#category').show()
  }

  function entryPage(){
  $('.screen').hide()
  $('#entry').show()
  CONTACTS.get()
  
  }
  function supplierPage(){
  $('.screen').hide()
  $('#supplier').show()
  }
  $('#entryType').change(function(e){
    $('#newEntryHead').empty()
    newEntry.type=e.target.value
    if(e.target.value=='recieved'){
        $('.forSupplier').show()
        $('.forExpense').hide()
        $('#newEntryHead').append(`
        <tr>
            <th style="width: 3vw;">No.</th>
            <th style="width: 14vw;">Product Name</th>
            <th style="width: 14vw;">details</th>
            <th style="width: 6vw;" data-toggle="tooltip" data-placement="bottom" title="Units in Stock">In Stock</th>
            <th style="width: 6vw;" data-toggle="tooltip" data-placement="bottom" title="Units to add">Adding Units</th>
            <th style="width: 6vw;">Rate</th>
            <th style="width: 6vw;">Weigth/Size</th>
            <th style="width: 6vw;">Gst</th>
            <th style="width: 6vw;">Cost</th>
            <th style="width: 4vw;">Action</th>
        </tr>
    `)
    }else{
      $('.forSupplier').hide()
      $('.forExpense').show()
      $('#newEntryHead').append(`
      <tr>
      <th style="width: 3vw;">No.</th>
      <th style="width: 14vw;">Product</th>
      <th>details</th>
      <th style="width: 6vw;" data-toggle="tooltip" data-placement="bottom" title="Units in Stock">In Stock</th>
      <th style="width: 6vw;" data-toggle="tooltip" data-placement="bottom" title="Units to be used">Using Units</th>
      <th style="width: 6vw;">Rate</th>
      <th style="width: 6vw;">Weigth/Size</th>
      <th style="width: 14vw;">Remarks</th>
      <th style="width: 6vw;">Cost</th>
      <th style="width: 4vw;">Action</th>
    </tr>
  `)
    }
   

  })
  productPage()
  const setProductTo=(e)=>{
    $('#productListToEntry').hide();
  }

  function printBill(){
    var element = document.getElementById('entryDetails');

   const opt = {
    margin:       0,
    filename:     'bill.pdf',
    image:        { type: 'png' },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'p' }
    };


 html2pdf(element, opt);

  }

  function productEntryDateFilter(){
    res=[]
    allEntry.map((c,i)=>{
        const products=c.products
                products.map(p=>{
                        let data=p;
                        const p1=allProducts.find(k=>k.productName==data.productName)
                        if(p1){
                            data.avl=p1.qty?p1.qty:0;
                        }
                        data.type=c.type;
                        data.dated=c.dated;
                        data.contactName=c.contactName
                        data.billNumber=c.billNumber
                        data.gstno=c.gstno
                        res.push(data)
                    
                })
            
    })
    productByDate= res
  
  }


function filterEntryGroupType(key){
    const type=$('#allEntryTypeFilter').val()
    if($('#entryGroup').val()=='Group'){
        printAllEntry(type)
        return
    }
    const from=$("#entryFromDate").val()
    const to=$("#entryToDate").val()
  console.log(key)
    printProductByDate(key,type,from,to)
}

function costChanged(){
    const tc=$('#entryProductTotalCost').val()
    const rt=$('#entryProductRate').val()
    const qt=$('#entryProductQty').val()
    const gst=$('#entryProductGst').val()
        const res=parseFloat(parseFloat(tc)/parseFloat(qt))
        if(res=='NaN'){
            return
        }
        $('#entryProductRate').val(res)
}
function gstChanged(){
    const gst=parseFloat($('#entryProductGst').val())
    const rt=$('#entryProductRate').val()
    const qt=$('#entryProductQty').val()
    const ct=parseFloat(parseFloat(parseFloat(rt)*parseFloat(qt)).toFixed(2))
    const gstAmt=parseFloat((gst/100)*ct).toFixed(2)
    $('#entryProductGstAmt').val(gstAmt)
    const nct=parseFloat(ct + parseFloat(gstAmt)).toFixed(2);
    $('#entryProductTotalCost').val(nct)
}


  function printProductByDate(key,type,fdate,tdate){
    let data=productByDate;
    if(type){
        data=data.filter(c=>c.type==type)
    }
    if(key){
        data=data.filter(c=>c.productName.toLowerCase().includes(key)||c.contactName.toLowerCase().includes(key)||c.billNumber.toLowerCase().includes(key)||c.gstno.toLowerCase().includes(key) || c.remarks.toLowerCase().includes(key) || c.category.toLowerCase().includes(key))
    }

    if(!tdate){
        tdate=new Date().getTime()
    }else{
        tdate=new Date(tdate).getTime()
    }
    if(fdate){
        fdate=new Date(fdate).getTime()
        let d=[]
        data.map(c=>{
            if(new Date(c.dated).getTime() >=fdate){
                d.push(c)
            }
        })

        data=data.filter(c=>new Date(c.dated).getTime() >=fdate && new Date(c.dated).getTime() <=tdate)
    }
    
    $("#entryListHead").empty()
    $("#entryMainList").empty()
    if(type=='recieved'){
        $("#entryListHead").append(`
            <tr>
               <th>Sn.</th>
               <th>Product</th>
               <th>Category</th>
               <th>Supplier/Shop</th>
               <th>GST No</th>
               <th>Bill No</th>
               <th>Rate</th>
               <th>Qty</th>
               <th>Cost</th>
               <th>Date</th>
              </tr>
        `)
    }else{
        $("#entryListHead").append(`
        <tr>
        <th>Sn.</th>
        <th>Product</th>
        <th>Units Used</th>
        <th>Units Avl</th>
        <th>Remarks</th>
        <th>Total Cost</th>
        <th>Date</th>
       </tr>
        `)
    }
    if(!data || data.length ==0){
        return
    }
    data.map((c,i)=>{
        if(c.type=='recieved'){
            $("#entryMainList").append(`
                <tr>
                   <td>${i+1}</td>
                   <td>${c.productName}</td>
                   <td>${c.category}</td>
                   <td>${c.contactName}</td>
                   <td>${c.gstno}</td>
                   <td>${c.billNumber}</td>
                   <td>${c.rate}</td>
                   <td>${c.qty}</td>
                   <td>${c.cost}</td>
                   <td>${c.dated}</td>
                  </tr>
            `)
        }else{
            $("#entryMainList").append(`
            <tr>
            <td>${i+1}</td>
            <td>${c.productName}</td>
            <td>${c.qty}</td>
            <td>${c.avl}</td>
            <td>${c.remarks}</td>
            <td>${c.cost}</td>
            <td>${c.dated}</td>
           </tr>
            `)
        }
    })
  }
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  function saveReq(){
    let rqm=req.get()
    const cat=$('#productReqCategoryFilter').val()
    if(cat){
        rqm=rqm.filter(c=>c.category==cat)
    }
    let data={
        products:JSON.stringify(rqm),
        totalCost:$('#reqCost').val(),
        dated:$('#reqDate').val(),
        category:cat,
        demandBy:$('#demandedBy').val(),
        remarks:$('#reqRemarks').val(),
    }
    if(!data.dated){
        say(0,'Select a date');
        return
    }
    if(!data.demandBy){
        say(0,'Demanded by is empty')
        return
    }
    if(!data.remarks){
        say(0,'Remarks is empty')
        return
    }
    const res=allRequirements.find(c=>c.remarks==data.remarks)
    if(res){
        say(0,'Remarks Matched: Please Change')
        return
    }
    REQUIREMENTS.add(data)
    
}
    
  function gotAllRequirements(e){
    allRequirements=e
    filterReqHisCategory()
  }







//   $('#newEntryProductList').change(function(e){
//     console.log(e.target)
//   })
function gotAllReq(){

    filterReqHisCategory()
}

$("#userF").empty()
if(user.role ==3){
  $("#userF").append(`
      <li><a class="dropdown-item" href="#" onclick="$('#profile').show()">Change Password</a></li>
      <li><a class="dropdown-item" href="#" onclick="USERS.logout()">Logout</a></li>
  `)
}else{
    $('.level3').hide()
  $("#userF").append(`
  <li><a class="dropdown-item" href="#" onclick="$('#profile').show()">Change Password</a></li>
  <li><a class="dropdown-item" href="#" onclick="USERS.logout()">Logout</a></li>
`)
}



function filterReqHisCategory(){
    let data=allRequirements
    if(!data){
        return
    }
    $('#reqlist').empty()
    data.map(c=>{
        $('#reqlist').append(`<option value='${c._id}'>${ c.remarks+' ('+c.products.length+' products)('+c.dated+")"} </option>`)
    })
    $('#reqlist').show()
}

function reqListPrint(){
    const res=$('#reqlist').val()
    const data=allRequirements.find(c=>c._id==res)
    printDoc.set(data)
   window.open('printReq.html')
}

function printEntry(){
    const data=allEntry.find(c=>c._id==currentEntryId)
    printDoc.set(data)
    window.open('printBill.html')
}

function printDiv(el) {
    var originalContents = document.body.innerHTML;
    try{
        $(".ph").hide();
    }catch{}
    var printContents = document.getElementById(el).innerHTML;
    document.body.innerHTML = printContents;

    window.print();
    window.location='home.html'
}

function tableToCSV(el) {
 
    // Variable to store the final csv data
    var csv_data = [];

    // Get each row data
    var rows = $(`#${el} tr`);
    for (var i = 0; i < rows.length; i++) {

        // Get each column data
        var cols = rows[i].querySelectorAll('td input,th');

        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            // Get the text data of each cell
            // of a row and push it to csvrow
            if(i==0){
                if(j!=10){
                    csvrow.push(cols[j].innerHTML);
                }
            }else{
                csvrow.push(cols[j].value);
            }
        }
        if(i!=0){
            csvrow=[i,...csvrow]
        }
        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }

    // Combine each row data with new line character
    csv_data = csv_data.join('\n');
    // Call this function to download csv file 
    downloadCSVFile(csv_data);

}

function downloadCSVFile(csv_data) {
 
    // Create CSV file object and feed
    // our csv_data into it
    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = "GfG.csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}

function productReqSelected(){
    const pn=$('#productReqSearch').val()
    const pd=allProducts.find(c=>c.productName==pn)
    if(pd){
        req.add(pd);
        $('#productReqSearch').val('')
        printProductReq();
    }

}

function newReqProduct(){
    let data={}
    const pn=$('#productReqSearch').val()
    const pd=allProducts.find(c=>c.productName==pn)
    if(pd){
        req.add(pd);
    }else{
        data.category=$('#productReqCategoryFilter').val()
        if(!data.category){
            say(0,'Select a valid category')
            return
        }
        data.productName=pn
        data._id=new Date().getTime()
        req.add(data)
    }
    $('#productReqSearch').val('')
    printProductReq();
}

function reqListEdit(){
    const res=$('#reqlist').val()
    const data=allRequirements.find(c=>c._id==res)
    req.save(data.products)
    printProductReq();
    printProduct()
    $('#demandedBy').val(data.demandBy)
    $('#reqRemarks').val(data.remarks)
    $('#reqDate').val(data.dated)
}

function requirementDeleted(e){
    allRequirements=allRequirements.filter(c=>c._id!=e._id)
    filterReqHisCategory()
    say(1,'Requirement deleted')
}

function deleteDraft(){
    req.clear()
    printProductReq();
    printProduct()
}

function historyDateChange(){
    const date=$('#historyDate').val()
    history.get(date)
}


CATEGORIES.get()
PRODUCTS.get()

//filterReqHisCategory()
