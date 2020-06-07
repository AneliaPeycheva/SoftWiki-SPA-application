export function successNotification(message){
   let notificationContainer=document.createElement('div');
   notificationContainer.setAttribute('id','notifications');
   let successBox=document.createElement('div');
   successBox.setAttribute('id','successBox');
   successBox.classList.add('notification');  
   successBox.innerHTML=`${message}`;
   console.log(successBox);
   
 notificationContainer.appendChild(successBox);
document.querySelector('body').appendChild(notificationContainer);
setTimeout(() => {
    notificationContainer.remove();
}, 3000);
  

}

export function errorNotification(message){
    let notificationContainer=document.createElement('div');
    notificationContainer.setAttribute('id','notifications');
    let errorBox=document.createElement('div');
    errorBox.setAttribute('id','errorBox');
    errorBox.classList.add('notification');  
    errorBox.innerHTML=`${message}`;
    console.log(errorBox);
    
  notificationContainer.appendChild(errorBox);
 document.querySelector('body').appendChild(notificationContainer);
 setTimeout(() => {
     notificationContainer.remove();
 }, 5000);
}    

// export function errorNotification(message){
//     let notificationContainer=document.createElement('div');
//     notificationContainer.setAttribute('id','notifications');    
//     notificationContainer.innerHTML=`<div id="errorBox" class="notification"></div>`;
//     notificationContainer.textContent=`${message}`;
//  document.querySelector('body').appendChild(notificationContainer);
//  setTimeout(() => {
//      notificationContainer.remove();
//  }, 6000);
// }




