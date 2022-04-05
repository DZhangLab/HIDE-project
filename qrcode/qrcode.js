let btn = document.querySelector(".button");
let qr_code_element = document.querySelector(".qr-code");

btn.addEventListener("click", () => {
    let DID = document.querySelector("#input_text");
    if(DID.value != "") {
        // check whether a qrcode already displayed
        if (qr_code_element.childElementCount > 0){
            qr_code_element.innerHTML = ""; // clear the qrcode
        }
        generate(DID);
    } else {
        console.log("bad input");
        qr_code_element.style = "display: none";
    }
})

function generate(DID){

    qr_code_element.style = "";

    var qrcode = new QRCode(qr_code_element, {
        text: `${DID.value}`,
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // a download button for the QRcode
    let download = document.createElement("button");
    qr_code_element.appendChild(download);

    let download_link = document.createElement("a");
    download_link.setAttribute("download", "qr_code.png");
    download_link.innerText = "Download";

    download.appendChild(download_link);

    let qr_code_img = document.querySelector(".qr-code img");
    let qr_code_canvas = document.querySelector("canvas");

    // assign href of the download link wtih src of the qrcode image 
    // or with the canvas dataURL
    if(qr_code_img.getAttribute("src") != null){
        setTimeout(() => {
            download_link.setAttribute("href", `${qr_code_img.getAttribute("src")}`);
        }, 300);
    } else {
        setTimeout(() => {
            download_link.setAttribute("href", `${qr_code_canvas.toDataURL()}`);
        }, 300);
    }
}