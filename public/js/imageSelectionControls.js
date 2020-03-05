async function onSelectedImageChanged(uri) {
  const img = await faceapi.fetchImage(uri);
  $(`#inputImg`).get(0).src = img.src;
  updateResults();
}

async function loadImageFromUrl(url) {
  const img = await requestExternalImage($("#imgUrlInput").val());
  $("#inputImg").get(0).src = img.src;
  updateResults();
}

async function loadImageFromUpload() {
  $("#loaderImg").show();
  const imgFile = $("#queryImgUploadInput").get(0).files[0];
  const img = await faceapi.bufferToImage(imgFile);
  $("#inputImg").get(0).src = img.src;
  $("#loaderImg").hide();
  updateResults();
}
