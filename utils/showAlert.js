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