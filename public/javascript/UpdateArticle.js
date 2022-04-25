$(document).ready(function() {
    $('#formAddArticle').submit(function (e) {
    e.preventDefault();
    var data = new FormData($('#formAddArticle')[0]);
    console.log(data);
    $.ajax({
        url: "/createArticle/update",
        enctype: 'multipart/form-data',
        type: 'PUT',
        contentType: false,
        processData: false,
        cache: false,
        data: data,
        success: function (response) {
            // window.location.href = "/createArticle";
            console.log(response);
            
        },
        error: function (xhr, textStatus, errorThrow){
            console.log(xhr.status);
        }
    })
})
})