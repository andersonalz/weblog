$(document).ready(function() {
    $('#formAddArticle').submit(function (e) {
    e.preventDefault();
    var data = new FormData($('#formAddArticle')[0]);
    // console.log(data);
    $.ajax({
        url: "/createArticle",
        enctype: 'multipart/form-data',
        type: 'POST',
        contentType: false,
        processData: false,
        cache: false,
        data: data,
        success: function (response) {
            $("#msgg").removeClass("d-none");
            setTimeout(() => {
                $("#msgg").addClass("d-none");
            }, 4000);
            $("input").val("");
            $("textarea").val("");
        },
        error: function (xhr, textStatus, errorThrow){
            alert(xhr.status)
            $("#msg").removeClass("d-none");
            setTimeout(() => {
                $("#msg").addClass("d-none");
            }, 4000);
            $("input").val("");
            $("textarea").val("");
        }
    })
})
})

