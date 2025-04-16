import Swal from 'sweetalert2';

export function showErrorAlert({title, message}) {
  return Swal.fire({
    icon: 'error',
    title: title || 'Error !',
    text: message,
    confirmButtonColor: '#e63946', 
  });
}

export async function showSuccessAlert({title, message, btnText}) {
  return Swal.fire({
    icon: 'success',
    title: title || 'Success !',
    text: message,
    confirmButtonText: btnText || 'Close', 
    confirmButtonColor: '#4CAF50',
  }).then(result => result.isConfirmed);
}

export async function showWarningAlert({title, message, btnText} = {}) {
  return Swal.fire({
    icon: 'warning',
    title: title || 'Are you sure?',
    text: message || 'This will delete your note permanently, are you extra sure you like to do this?',
    confirmButtonText: btnText || 'Yes, delete', 
    showCancelButton: true,
  }).then(result => result.isConfirmed);
}