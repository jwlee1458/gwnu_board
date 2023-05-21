function validateBookRegisteration() {
    if(document.getElementById('id').value === '') {
        alert('등록번호가 비워져 있습니다.');
        return false;
    }

    if(document.getElementById('place').value === '') {
        alert('위치가 비워져 있습니다.');
        return false;
    }

    if(document.getElementById('isbn').value === '') {
        alert('ISBN이 비워져 있습니다.');
        return false;
    }

    if(document.getElementById('title').value === '') {
        alert('제목이 비워져 있습니다.');
        return false;
    }

    if(document.getElementById('author').value === '') {
        alert('저자가 비워져 있습니다.');
        return false;
    }

    if(document.getElementById('publisher').value === '') {
        alert('출판사가 비워져 있습니다.');
        return false;
    }

    let pricePattern = /^[0-9]+$/;
    if(!document.getElementById('price').value.match(pricePattern)) {
        alert('값은 정수입니다.');
        return false;
    }

    return true;
}

// $(document).ready(
//     $('form').submit(function() {
//         if($('#id').val() === '') {
//             alert('등록번호가 비워져 있습니다.');
//             return false;
//         }

//         if($('#place').val() === '') {
//             alert('위치가 비워져 있습니다.');
//             return false;
//         }

//         if($('#isbn').val() === '') {
//             alert('ISBN이 비워져 있습니다.');
//             return false;
//         }

//         if($('#title').val() === '') {
//             alert('제목이 비워져 있습니다.');
//             return false;
//         }

//         if($('#author').val() === '') {
//             alert('저자가 비워져 있습니다.');
//             return false;
//         }

//         if($('#publisher').val() == '') {
//             alert('출판사가 비워져 있습니다.');
//             return false;
//         }

//         let pricePattern = /^[0-9]+$/;
//         if(!$('#price').val().match(pricePattern)) {
//             alert('가격은 정수입니다.')
//             return false;
//         }

//         return true;
//     })
// )