const deleteBtn = document.querySelectorAll('.fa-trash')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    console.log(itemText)
    try{
        const response = await fetch('deleteItem',{
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}