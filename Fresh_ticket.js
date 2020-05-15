let ticket_no = 0;
const form_data = () =>{
    let ticket = {};
    ticket.name = document.getElementById("name").value.trim();
    ticket.email = document.getElementById("contact").value.trim();
    ticket.subject = document.getElementById("subject").value.trim();
    ticket.type = document.getElementById("ttype").value;
    ticket.status = Number(document.getElementById("tstatus").value);
    ticket.priority = Number(document.getElementById("tpriority").value);
    ticket.description = document.getElementById("description").value.trim();
    return ticket;
};

const delAllChild = (divelem) =>{
    let child = divelem.lastElementChild;
    while(child){
        divelem.removeChild(child);
        child = divelem.lastElementChild;
    } 
};

const validate_data = (ticket) => {
    const mailformat =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(ticket.name.localeCompare("") === 0)
        return "Please enter username";
    if(ticket.email.match(mailformat) == null)
        return "Please enter a valid email";
    if(ticket.subject.localeCompare("") === 0)
        return "Please enter subject";
    if(ticket.description.localeCompare("") === 0)
        return "Please enter description";
    return "valid";
};

const set_defaults = () => {
    document.getElementById("name").value = "";
    document.getElementById("contact").value="";
    document.getElementById("subject").value="";
    document.getElementById("ttype").options[0].selected = true;
    document.getElementById("tstatus").options[0].selected = true;
    document.getElementById("tpriority").options[0].selected = true;
    document.getElementById("description").value="";
    let divelem = document.getElementById("errormsg");
    delAllChild(divelem);
}

const create_ticket = async(ticket) => {
        const url="https://njin353.freshdesk.com/api/v2/tickets";
        const response= await fetch(url, {
            method:'POST',
            headers: {
                "Authorization": "Basic " + btoa("9Y7nxoM8s69UD5LEg2n6" + ":x"),
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(ticket)
        })
        if(response.ok){
            set_defaults();
            let json= await response.json();
            let errmsg = document.getElementById("errormsg");
            delAllChild(errmsg);
            let errpara = document.createElement("P");
            errpara.setAttribute("Id", "successmsg");
            errpara.appendChild(document.createTextNode("Your ticket number is " + json.id));
            errmsg.appendChild(errpara);
        }
        else{
            let errmsg = document.getElementById("errormsg");
            delAllChild(errmsg);
            let errpara = document.createElement("P");
            errpara.appendChild(document.createTextNode("Something Went Wrong"));
            errmsg.appendChild(errpara);
        }
};

const initial_load = () =>{
    let upbtn = document.getElementById("upbtn");
    upbtn.classList.add("crclass");
    let dlbtn = document.getElementById("dlbtn");
    dlbtn.classList.add("crclass");
    let cdivbtn = document.getElementById("cdivbtn");
    cdivbtn.classList.add("crclass");
    document.getElementById("description").disabled=false;
    document.getElementById("subject").disabled=false;
    let canbtn = document.getElementById("canbtn");
    canbtn.classList.remove("crclass");
    let subtn = document.getElementById("subtn");
    subtn.classList.remove("crclass");
    document.getElementById("sbox").value = "";
    document.getElementById("name").disabled=false;
    set_defaults();
    ticket_no=0;
}

cdivbtn.addEventListener("click", initial_load);

subtn.addEventListener("click", ()=>{
    let ticket = form_data();
    let data_validate = validate_data(ticket);
    if(data_validate.localeCompare("valid") === 0){
        create_ticket(ticket);
    }
    else{
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.appendChild(document.createTextNode("*" + data_validate));
        errmsg.appendChild(errpara);
    }
});

canbtn.addEventListener("click" , set_defaults);

sboxbtn.addEventListener("click", async()=>{
    let ticket_id = Number(document.getElementById("sbox").value);
    const url=`https://njin353.freshdesk.com/api/v2/tickets/${ticket_id}?include=requester`;
    let response = await fetch(url,{
            method:'GET',
            headers: {
                "Authorization": "Basic " + btoa("9Y7nxoM8s69UD5LEg2n6" + ":x"),
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        });
    if (response.ok) {
        set_defaults();
        document.getElementById("name").disabled=true;
        let canbtn = document.getElementById("canbtn");
        canbtn.classList.add("crclass");
        let subtn = document.getElementById("subtn");
        subtn.classList.add("crclass");
        let upbtn = document.getElementById("upbtn");
        upbtn.classList.remove("crclass");
        let dlbtn = document.getElementById("dlbtn");
        dlbtn.classList.remove("crclass");
        let cdivbtn = document.getElementById("cdivbtn");
        cdivbtn.classList.remove("crclass");
        let json = await response.json();
        document.getElementById("name").value = json.requester.name;
        document.getElementById("contact").value = json.requester.email;
        document.getElementById("subject").value=json.subject;
        document.getElementById("ttype").value = (json.type == null) ? "": json.type;
        document.getElementById("tstatus").value =json.status
        document.getElementById("tpriority").value = json.priority ;
        document.getElementById("description").value = json.description_text;
        ticket_no = ticket_id;
    } 
    else
    {
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.appendChild(document.createTextNode("No such ticket"));
        errmsg.appendChild(errpara);
    }
});

const update_ticket = async(ticket) => {
    const url=`https://njin353.freshdesk.com/api/v2/tickets/${ticket_no}`;
    const response= await fetch(url, {
        method:'PUT',
        headers: {
            "Authorization": "Basic " + btoa("9Y7nxoM8s69UD5LEg2n6" + ":x"),
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(ticket)
    });
    if(response.ok){
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.setAttribute("Id", "successmsg");
        errpara.appendChild(document.createTextNode("Your ticket updated successfully"));
        errmsg.appendChild(errpara);
    }
    else
    {
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.appendChild(document.createTextNode("Something Went Wrong"));
        errmsg.appendChild(errpara);  
    }   
};

upbtn.addEventListener("click", ()=>{
    let ticket = form_data();
    let data_validate = validate_data(ticket);
    if(data_validate.localeCompare("valid") === 0){
        update_ticket(ticket);
    }
    else{
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.appendChild(document.createTextNode("*" + data_validate));
        errmsg.appendChild(errpara);
    }
});

const del_ticket = async(T_number) => {
    const url=`https://njin353.freshdesk.com/api/v2/tickets/${T_number}`;
    const response= await fetch(url, {
        method:'DELETE',
        headers: {
            "Authorization": "Basic " + btoa("9Y7nxoM8s69UD5LEg2n6" + ":x"),
            'Accept': 'application/json',
            'Content-Type':'application/json'
        },
    });
    if(response.status == 204){
        initial_load();
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.setAttribute("Id", "successmsg");
        errpara.appendChild(document.createTextNode("Your ticket deleted successfully"));
        errmsg.appendChild(errpara);
    }
    else
    {
        let errmsg = document.getElementById("errormsg");
        delAllChild(errmsg);
        let errpara = document.createElement("P");
        errpara.appendChild(document.createTextNode("Ticket Already Deleted, Viewing from Restore Portal"));
        errmsg.appendChild(errpara);  
    }    
};

dlbtn.addEventListener("click", ()=> del_ticket(ticket_no));
