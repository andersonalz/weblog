/*!
 * Start Bootstrap - Blog Home v5.0.7 (https://startbootstrap.com/template/blog-home)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-blog-home/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project
// document.getElementById("liveToastBtn").onclick = function(){
//     var toastLiveExample = document.getElementById('liveToast')
//     var toast = new bootstrap.Toast(toastLiveExample)
//     toast.show()
// }

$(document).ready(function () {
    $("#formAddArticle").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var actionUrl = form.attr("action");
        $.ajax({
            type: "post",
            url: actionUrl,
            data: form.serialize(),
            success: function (response) {
                    var toastLiveExample = document.getElementById('liveToast')
                    var toast = new bootstrap.Toast(toastLiveExample)
                    toast.show()
                $("#input_comment").val("")
            },
            error: function (error) {
                console.log(1)
                location.href = "http://localhost:4000/signIn"

            }
        });
    });
});
