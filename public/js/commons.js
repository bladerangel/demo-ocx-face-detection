async function requestExternalImage(imageUrl) {
  const res = await fetch("fetch_external_image", {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      imageUrl
    })
  });
  if (!(res.status < 400)) {
    console.error(res.status + " : " + (await res.text()));
    throw new Error("failed to fetch image from url: " + imageUrl);
  }

  let blob;
  try {
    blob = await res.blob();
    return await faceapi.bufferToImage(blob);
  } catch (e) {
    console.error("received blob:", blob);
    console.error("error:", e);
    throw new Error("failed to load image from url: " + imageUrl);
  }
}

function renderNavBar(navbarId, exampleUri) {
  const examples = [{
      uri: "face_detection",
      name: "Detecção de Faces"
    },
    {
      uri: "face_recognition",
      name: "Reconhecimento Facial"
    },
    {
      uri: "face_extraction",
      name: "Extração de Faces"
    },
    {
      uri: "webcam_face_detection",
      name: "Detecção de Faces via Webcam"
    }
  ];

  const navbar = $(navbarId).get(0);
  const pageContainer = $(".page-container").get(0);

  $("#content").on("show", () => {
    const header = document.createElement("h3");
    header.innerHTML = examples.find(ex => ex.uri === exampleUri).name;
    header.style.textAlign = "center";
    pageContainer.insertBefore(header, pageContainer.children[0]);
  });

  const menuContent = document.createElement("ul");
  menuContent.id = "slide-out";
  menuContent.classList.add("side-nav", "fixed");
  navbar.appendChild(menuContent);

  const menuButton = document.createElement("a");
  menuButton.href = "#";
  menuButton.classList.add("button-collapse", "show-on-large");
  menuButton.setAttribute("data-activates", "slide-out");
  const menuButtonIcon = document.createElement("img");
  menuButtonIcon.src = "images/menu_icon.png";
  menuButton.appendChild(menuButtonIcon);
  navbar.appendChild(menuButton);

  const img = document.createElement("img");
  img.src = "images/face-icon.png";
  img.width = "250";
  img.style.paddingTop = "10px";
  img.style.paddingBottom = "30px";
  menuContent.appendChild(img);

  examples.forEach(ex => {
    const li = document.createElement("li");
    if (ex.uri === exampleUri) {
      li.style.background = "#b0b0b0";
    }
    const a = document.createElement("a");
    a.classList.add("waves-effect", "waves-light", "pad-sides-sm");
    a.href = ex.uri;
    const span = document.createElement("span");
    span.innerHTML = ex.name;
    span.style.whiteSpace = "nowrap";
    a.appendChild(span);
    li.appendChild(a);
    menuContent.appendChild(li);
  });

  $(".button-collapse").sideNav({
    menuWidth: 260
  });
}

function renderOption(parent, text, value) {
  const option = document.createElement("option");
  option.innerHTML = text;
  option.value = value;
  parent.appendChild(option);
}

function convertBase64ToFile(base64, name) {
  base64 = atob(base64.split(",")[1]);
  let array = [];
  for (var i = 0; i < base64.length; i++) {
    array.push(base64.charCodeAt(i));
  }
  return new File([new Uint8Array(array)], name, {
    type: "image/png"
  });
}