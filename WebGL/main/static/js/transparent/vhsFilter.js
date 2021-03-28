const images = document.querySelectorAll(".js-vhs-filter");

images.forEach(image => VHSify(image));


function VHSify(image) {
    if (
        !CSS.supports("mix-blend-mode", "screen") ||
        !CSS.supports("filter", "url()")
    ) {
        return;
    }
    const container = document.createElement("div");
    const images = RGBImages(image);

    images.forEach(image => container.appendChild(image));
    container.classList.add("vhs-filter");
    container.style.zIndex = -3;
    container.id = "container";

    image.replaceWith(container);
}

function RGBImages(image) {
    const colors = ["r", "g", "b"];
    const images = colors.map(color => {
        const img = image.cloneNode();
        img.classList.add(`vhs-filter__${color}`);
        return img;
    });

    return images;
}

setInterval(function(){ 
//vhs-filter-hover
//document.getElementById("container").className+="vhs-filter-hover";

}, 3000);

