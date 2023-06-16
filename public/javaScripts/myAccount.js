
function toggleAddCard() {
    var card = document.getElementById('card-address');
    if (card.style.display === 'none') {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  }
  function toggleEditCard(index) {
      const card = document.getElementById(`edit-address${index}`);
      if (card.style.display === "none") {
          card.style.display = "block";
      } else {
          card.style.display = "none";
      }
  }
  function toggleprofileCard() {
    const card = document.getElementById('card-profile');
    if (card.style.display === "none") {
        card.style.display = "block";
    } else {
        card.style.display = "none";
    }
}

  var errorName = document.getElementById('name')
  var errorEmail = document.getElementById('email')
  var errorPhonenumber = document.getElementById('phonenumbers')
  var errorLastName = document.getElementById('lastname')
  
  function validateName() {
      const name = document.getElementById('Name').value;
      if (name == "") {
          errorName.innerHTML = 'Enter your first name'
          return false
      }
      if (!name.match(/^[a-zA-Z ]*$/)) {
          errorName.innerHTML = 'Numbers are not allowed'
          return false
      }
      errorName.innerHTML = null
      return true
  }
  function validateLastName() {
      const lastname = document.getElementById('lastName').value;
      if (lastname == "") {
          errorLastName.innerHTML = 'Enter your last name'
          return false
      }
      if (!name.match(/^[a-zA-Z ]*$/)) {
          errorLastName.innerHTML = 'Numbers are not allowed'
          return false
      }
      errorLastName.innerHTML = null
      return true
  }


  function validEmail() {
      const email = document.getElementById('Email').value
      if (email == "") {
          errorEmail.innerHTML = "Enter your email address"
          return false
      }
      if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
          errorEmail.innerHTML = 'Enter a proper email address'
          return false
      }
      errorEmail.innerHTML = null
      return true
  }

    

   function validPhonenumber() {
      const mob = document.getElementById('phonenumber').value
      if (mob == "") {
          errorPhonenumber.innerHTML = "Enter a phonenumber"
          return false
      }
      if (mob.length < 10 || !mob.match(/^\d*$/)) {
          errorPhonenumber.innerHTML = "Please Enter the valid phone number"
          return false
      }

      if (mob.length > 10) {
          errorPhonenumber.innerHTML = "Please Enter the valid phone number"
          return false
      }
      errorPhonenumber.innerHTML = null
      return true
  }

  function validation() {
      if (!validateName() ||!validateLastName()|| !validEmail() || !validPhonenumber()) {
          return false
      }
      return true
  }

  const errorfirstname = document.getElementById('editfirst');
  const errorlastname = document.getElementById('editlast');
  const errorEditEmail = document.getElementById('editemail');
  const errorMobile = document.getElementById('editnumbers')

  function validateEditName(){
    const name = document.getElementById('editfirstname').value;
    if (name == "") {
        errorfirstname.innerHTML = 'Enter your first name'
        return false
    }
    if (!name.match(/^[a-zA-Z ]*$/)) {
        errorfirstname.innerHTML = 'Numbers are not allowed'
        return false
    }
    errorfirstname.innerHTML = null
    return true

  }
  function validateEditLastName(){
    const name = document.getElementById('editlastName').value;
    if (name == "") {
        errorlastname.innerHTML = 'Enter your first name'
        return false
    }
    if (!name.match(/^[a-zA-Z ]*$/)) {
        errorlastname.innerHTML = 'Numbers are not allowed'
        return false
    }
    errorlastname.innerHTML = null
    return true

  }
  function validEditEmail() {
    const email = document.getElementById('editEmail').value
    if (email == "") {
        errorEditEmail.innerHTML = "Enter your email address"
        return false
    }
    if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
        errorEditEmail.innerHTML = 'Enter a proper email address'
        return false
    }
    errorEditEmail.innerHTML = null
    return true
}
function validEditPhonenumber() {
    const mob = document.getElementById('editphonenumber').value
    if (mob == "") {
        errorMobile.innerHTML = "Enter a phonenumber"
        return false
    }
    if (mob.length < 10 || !mob.match(/^\d*$/)) {
        errorMobile.innerHTML = "Please Enter the valid phone number"
        return false
    }

    if (mob.length > 10) {
        errorMobile.innerHTML = "Please Enter the valid phone number"
        return false
    }
    errorMobile.innerHTML = null
    return true
}

  function editValidation(){
    if (!validateEditName() || !validateEditLastName() || !validEditEmail()|| !validEditEmail()) {
        return false
    }
    return true

  }
  const profileNameError = document.getElementById('nameError');
  const profileEmailError = document.getElementById('emailError');
  const profilePhoneError = document.getElementById('phoneError');
  function validateProfileName(){
    const name = document.getElementById('profileName').value;
    if (name == "") {
        profileNameError.innerHTML = 'Enter your first name'
        return false
    }
    if (!name.match(/^[a-zA-Z ]*$/)) {
        profileNameError.innerHTML = 'Numbers are not allowed'
        return false
    }
    profileNameError.innerHTML = null
    return true

  }
  function validProfileEmail() {
    const email = document.getElementById('profileEmail').value
    if (email == "") {
        profileEmailError.innerHTML = "Enter your email address"
        return false
    }
    if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
        profileEmailError.innerHTML = 'Enter a proper email address'
        return false
    }
    profileEmailError.innerHTML = null
    return true
}
function validProfilenumber() {
  const mob = document.getElementById('profilenumber').value
  if (mob == "") {
      profilePhoneError.innerHTML = "Enter a phonenumber"
      return false
  }
  if (mob.length < 10 || !mob.match(/^\d*$/)) {
      profilePhoneError.innerHTML = "Please Enter the valid phone number"
      return false
  }

  if (mob.length > 10) {
      profilePhoneError.innerHTML = "Please Enter the valid phone number"
      return false
  }
  profilePhoneError.innerHTML = null
  return true
}

function profileValidation(){
  if(!validateProfileName() ||validProfileEmail()||validProfilenumber() ){
    return false
  }
  return true
}

const errorPassword = document.getElementById('passwordError');
const newError = document.getElementById('newpasswordError')
const confirmError = document.getElementById('confirmError')

function currentPassword() {
  const psd = document.getElementById('currentpassword').value
  if (psd == "") {
      errorPassword.innerHTML = "Enter a password"
      return false
  }
  if (psd.length < 5) {

      errorPassword.innerHTML = "Enter a valid password"
      return false
  }
  errorPassword.innerHTML = null
  return true
}
function newPassword() {
  const psd = document.getElementById('newpassword').value
  if (psd == "") {
    newError.innerHTML = "Enter a password"
      return false
  }
  if (psd.length < 5) {

    newError.innerHTML = "Password should be more than five characters"
      return false
  }
  newError.innerHTML = null
  return true
}
function confirmPassword() {
  const cpsd = document.getElementById('newpassword').value
  const psd = document.getElementById('confirmpassword').value
  if(psd != cpsd){
    confirmError.innerHTML = "Password not matching"
      return false
  }
  if (cpsd == "") {
    confirmError.innerHTML = "Confirm your password"
      return false
  }
  confirmError.innerHTML = null
  return true
} 

function validateChangePassword(){
  if(!currentPassword() || !newPassword() || !confirmPassword()){
    return false;
  }
  return true
}





  $('#addAddress').submit((e)=>{
    console.log("haii im in");
    e.preventDefault()
    $.ajax({
        url:'add-address',
        type:'PATCh',
        data:$('#addAddress').serialize(),
        success:(response=>{
            if(response.status){
                Swal.fire({
                    icon: 'success',
                    title: 'Address addedd succesfully',
                    showConfirmButton: false,
                    timer: 1500
                 }).then(() => {
                    location.reload();
              });
             
             }
           
        })
    })
})
$('#editAddress').submit((e)=>{
    console.log("haii im editinggg");
    e.preventDefault()
    var addressId = $('#save-button-address').val();
    var formData = $('#editAddress').serialize();
    formData += '&addressId=' + encodeURIComponent(addressId);
    $.ajax({
        url:'/edit-address',
        type:'PATCH',
        data:formData,
        success:(response=>{
            if(response.status){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Address edited succesfully',
                    showConfirmButton: false,
                    timer: 1500
                })
              .then(() => {
                 location.href = '/my-account'
              });
             }
           
        }) 
    })
})
function deleteAddress(id){
  let address = {}
  address.id = id
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#4CAF50',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:'delete-address',
        type:'DELETE',
        data:address,
        success:(response=>{
          if(response.status){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Address deleted succesfully',
              showConfirmButton: false,
              timer: 1500
          }).then(()=>{
            location.href = '/my-account'
          })
        }
        })
      })
    }
  })
}
 
$('#editprofile').submit((e)=>{
  console.log("haii im editing the profile");
  e.preventDefault()
  var formData = $('#editprofile').serialize();
  $.ajax({
    url:'edit-profile',
    type:'PATCH',
    data:formData,
    success:(response=>{
      if(response.status){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Profile edited succesfully',
          showConfirmButton: false,
          timer: 1500
      }).then(()=>{
        location.href = '/my-account'
      })
    }else{
      location.href = '/my-account'
    }
    })
  })
})

$('#changePassword').submit(e=>{
  console.log("haii im changing passsword");
  e.preventDefault()
  var formData = $('#changePassword').serialize();
  $.ajax({
    url:'change-password',
    type:'PATCH',
    data:formData,
    success:(response=>{
      if(response.status){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password changed succesfully',
          showConfirmButton: false,
          timer: 1500
      }).then(()=>{
        location.href = '/my-account'
      })
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'password didnt match',
          showConfirmButton: false,
          timer: 1500
      })
      // .then(()=>{
     // location.href = '/my-account'
      // })
    }
    })
  })
})


