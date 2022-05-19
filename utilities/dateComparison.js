module.exports = (dueDate)=>{
    const today = new Date().toISOString().split('T')[0];
    const duedate = dueDate.split(' ')[0];

    let dueDateComprarison = "";
    if(today>duedate){
      return  dueDateComprarison='Delivery is late'
    }else if(today<duedate){
       return  dueDateComprarison='Early Delivery'
    }else{
       return  dueDateComprarison='Delivery on time'
    }
}