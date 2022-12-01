
//const host=`http://3.87.219.181:3000`
const host=`http://localhost:3000`
const allUsersUrl=`${host}/api/user/users`
const userLoginUrl=`${host}/api/user/login`
const userChangePasswordUrl=`${host}/api/user/changepassword`
const allProductsUrl=`${host}/api/product`
const allCategoryUrl=`${host}/api/category`
const allEntryUrl=`${host}/api/entry`
const allContactUrl=`${host}/api/contact`
const allRequirementUrl=`${host}/api/requirement`

let productByDate=[]
let allUsers;
let allRequirements;
let allProducts=[];
let allCategory;
let allContact;
let allEntry;
let deleteCont=0;
let reqProduct=[]
let user

function conn(type,url,data,suc,fail){
    $.ajax({
        url,
        data,
        type,
        dataType: "json",
        crossDomain: true,
        encode:true,
        success: suc,
        error:fail
        })
}
const PRODUCTS={
    clear:function(){
        localStorage.removeItem('products')
    },
    save:function(e){
        localStorage.products=JSON.stringify(e)
    },
    get:async function(){
        const res=await fetch(allProductsUrl);
        const data= await res.json()
        allProducts=data
        gotAllProduct(data)
    },
    add:function(e){
        if(e){
            if(!e.productName){
                say(0,'Name is empty')
                console.log('Name is empty')
                return
            }
            if(!e.category){
                say(0,'Category is empty')
                console.log('Name is empty')
                return
            }
            data={
                productName:e.productName,
                used:0,
                category:e.category,
                contactName:'',
                qty:e.qty?e.qty:0,
                details:e.details?e.details:'',
                rate:e.rate?e.rate:null,
                size:e.size?e.size:null,
                createdBy:user._id
            }
            let url=allProductsUrl
            conn('POST',url,data,productCreated,()=>{say(0,'Error: Product Conn failed')})
        }
        return
    },
    delete:function(id,name){
        allProducts=allProducts.filter(c=>c._id!=id)
        let url=allProductsUrl+`/${user._id}/${id}`
        conn('DELETE',url,null,productDeleted,()=>{say(0,'Error: Product Conn failed')})
    },
    update:function(id,data){
        let prod=allProducts
        let res=prod.find(c=>c._id==id)
        const index=prod.indexOf(res)
        Object.keys(data).forEach(c=>{
            res[c]=data[c];
        })
        prod[index]=res
        allProducts=prod;
        data._id=id
        let url=allProductsUrl+`/${user._id}`;
        console.log(data)
        conn('PUT',url,data,productUpdated,()=>{say(0,'Error: Product Conn failed')})
    }

}

const USERS={
    clear:function(){
        localStorage.removeItem('users')
    },
    save:function(e){
        localStorage.users=JSON.stringify(e)
    },
    get:function(name){
        let res=JSON.parse(localStorage.users)
        return res
    },
    login:function(name,password){
        
        if(!name){
            say(0,'Login failed: username or password is inccorect')
            return
        }
        if(!password){
            say(0,'Login failed: username or password is inccorect')
            return
        }
        const data={
            email:name,
            password:password
        }
        conn('POST',userLoginUrl,data,userLogin,()=>{say(0,'Error: Login failed')})
    },
    logout:function(){
       this.clear()
        window.location="login.html"
    },
    profile:function(){
        let res=this.get()
        return res
    },
    update:function(oldpass,newPassword){
        if(!oldpass){
            say(0,'Enter old password')
            return
        }
        if(!newpass){
            say(0,'Enter new password')
            return
        }
        let data={
            email:user.email,
            password:oldpass,
            newPassword:newPassword
        }
        conn('POST',userChangePasswordUrl,data,passwordChanged,()=>{say(0,'Error: Wrong Old Password')})
    },
    resetUser:function(){
        if(user.role!=3){
            say(0,'You can not reset user passwords')
            return
        }
        
    }


}

function passwordChanged(){
    $('#oldpass').val('')
    $('#newpass').val('')
    say(1,'Password Changed')
}
function userLogin(data){
    if(data._id){
        USERS.save(data);
        window.location='home.html'
        return
    }
    say(0,'Login error')
}


const CATEGORIES={
    clear:function(){
        localStorage.removeItem('categories')
    },
    save:function(e){
        localStorage.categories=JSON.stringify(e)
    },
    get: async function(id,name){
        if(allCategory){
            return allCategory
        }
        const res=await fetch(allCategoryUrl)
        allCategory=await res.json()
        gotAllCategory()
    },
    add:function(e){
        if(e){
            data=e;
            let url=allCategoryUrl+'/'+user._id;
            conn('POST',url,data,categoryCreated,()=>{say(0,'Error: Category Conn failed')})
        }
    },
    delete:function(name){
        allCategory=allCategory.filter(c=>c.name!=name)
        let url=allCategoryUrl+`/${user._id}/${name}`
        conn('DELETE',url,null,gotAllCategory,()=>{say(0,'Error: Category Conn failed')})
    },
    update:function(id,data){
        let categories=this.get()
        let res=categories.filter(c=>c._id==id)
        const index=categories.indexOf(res)
        Object.keys(data).forEach(c=>{
            res[c]=data[c];
        })
        categories[index]=res
        this.save(categories);
        return categories
    }

}


const CONTACTS={
    get:async function(id,name){
        if(allContact){
            return allContact
        }
        const res=await fetch(allContactUrl);
        allContact=await res.json()
        gotAllContact()
    },
    add:function(e){
        if(e){
            if(!e.name){
                say(0,'Name is empty')
                console.log('name is empty')
                return
            }
            data={
                name:e.name,
                gstno:e.gstno?e.gstno:null,
                contactPerson:e.contactPerson?e.contactPerson:null,
                mobile:e.mobile?e.mobile:'',
                email:e.email?e.email:'',
                address:e.address?e.address:''
            }
            let url=allContactUrl+`/${user._id}`
            conn('POST',url,data,contactCreated,()=>{say(0,'Contact Created Error')})
        }
    },
    delete:function(id){
        allContact=allContact.filter(c=>c._id!=id)
        let url=allContactUrl+`/${user._id}/${id}`
        conn('DELETE',url,null,contactDeleted,()=>{say(0,'Error: Contact Conn failed')})
    },
    update:function(id,data){
        let contacts=allContact
        let res=contacts.filter(c=>c._id==id)
        const index=contacts.indexOf(res)
        Object.keys(data).forEach(c=>{
            res[c]=data[c];
        })
        contacts[index]=res
        allContact=contacts
        let url=allContactUrl+`/${user._id}`
        conn('PUT',url,data,contactUpdated,()=>{say(0,'Contact Created Error')})
    }

}


const ENTRIES={
    get:async function(){
        if(allEntry){
            filterEntryType()
            return
        }
        const result=await fetch(allEntryUrl)
        allEntry= await result.json()
        gotAllEntry()
        
    },
    add:function(data){
        if(data){
            let url=allEntryUrl+`/${user._id}`
            conn('POST',url,data,entryCreated,()=>{say(0,'Entry Create Error')})
        }
    },
    delete:function(id){
        if(id){
            let url=allEntryUrl+`/${user._id}/${id}`
            conn('DELETE',url,null,entryDeleted,()=>{say(0,'Entry was not deleted')})
        }
    },
    restore:function(id){
        if(id){
            let url=allEntryUrl+`/restore/${user._id}/${id}`
            conn('DELETE',url,null,entryDeleted,()=>{say(0,'Entry was not deleted')})
        }
    },
    update:function(id,data){
        let entries=this.get()
        let res=entries.filter(c=>c._id==id)
        const index=entries.indexOf(res)
        Object.keys(data).forEach(c=>{
            res[c]=data[c];
        })
        entries[index]=res
        this.save(entries);
        return entries
    }

}


const REQUIREMENTS={
    get:async function(){
       if(allRequirements){
        return allRequirements;
       }
       const res= await fetch(allRequirementUrl);
       allRequirements=await res.json()
       gotAllRequirements(allRequirements)
    },
    add:function(data){
        let url=allRequirementUrl+`/${user._id}`
        conn('POST',url,data,requirementCreated,()=>{say(0,'Entry Create Error')})
    },
    print:function(data){
        if(data){
            localStorage.printReq=JSON.stringify(data);
        }
        else{
            return JSON.parse(localStorage.printReq)
        }
    },
    delete:function(id){
        let requirements=this.get()
        requirements=requirements.filter(c=>c._id!=id)
        this.save(requirements)
    },
    update:function(id,data){
        let requirements=this.get()
        let res=requirements.filter(c=>c._id==id)
        const index=requirements.indexOf(res)
        Object.keys(data).forEach(c=>{
            res[c]=data[c];
        })
        requirements[index]=res
        this.save(requirements);
        return requirements
    }

}

const printDoc={
    get:function(){
        if(localStorage.printDoc){

            return JSON.parse(localStorage.printDoc)
        }
    },
    set:function(e){
        localStorage.printDoc=JSON.stringify(e)
    }
}