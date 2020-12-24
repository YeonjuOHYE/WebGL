async function loadFile(url) {
    const req = await fetch(url);
    return req.text()
}
function parseData(text) {
    const data = [];
    const settings = { data };
    let max;
    let min;
    //split into lines
    text.split('\n').forEach((line) => {
        //split the line by whitespace
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
            //only 2 parts, must be a key/value pair
            settings[parts[0]] = parseFloat(parts[1])
        }
        else if (parts.length > 2) {
            //more than 2 parts, must be data
            const values = parts.map((v) => {
                // parts list를 순회하면서 해당하는 파라미터를 넣은 리스트 생성
                const value = parseFloat(v);
                // -9999
                if (value === settings.NODATA_value) {
                    return undefined;
                }
                max = Math.max(max === undefined ? value : max, value);
                min = Math.min(min === undefined ? value : min, value);
                return value;
            });
            data.push(values)
        }
    });
    // dictionary 재생성. 첫 인자 memory에 추가로 덧붙임
    return Object.assign(settings, { min, max });
}

function drawData(file) {
    const { min, max, ncols, nrows, data } = file;
    const range = max - min;
    console.log(min);
    console.log(max);
    console.log(ncols);
    console.log(nrows);
    console.log(data);
    var canvas = document.createElement('canvas');

    document.getElementById("threejs_canvas").appendChild(canvas);
    const ctx = canvas.getContext('2d');
    // make the canvas the same size as the data
    
    ctx.canvas.width = window.outerWidth ;
    ctx.canvas.height = window.outerWidth *nrows/ncols ;
    ctx.fillStyle = '#444';

    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.log(file);
    console.log(window.outerWidth * 1 / data.length)
    data.forEach((row, latNdx) => { //145
        row.forEach((value, lonNdx) => {

            if (value === undefined) {
                return;
            }
            const amount = (value - min) / range;//0~1 normalize
            const hue = 0.5;
            const saturation = 1;
            const lightness = amount;
            ctx.fillStyle = hsl(hue, saturation, lightness);
            ctx.fillRect(window.outerWidth * lonNdx / row.length ,window.outerWidth *nrows *latNdx/(ncols*data.length), window.outerWidth/700 , window.outerWidth/700);
            // ctx.fillRect(lonNdx, latNdx, 1, 1);
        });
    });
}
function px(v) {
    return `${v | 0}px`;
}
function hsl(h, s, l) {
    return `hsl(${h * 360 | 0},${s * 100 | 0}%,${l * 100 | 0}%)`;
}
loadFile('/media/main/earth_globe/gpw_v4_basic_demographic_characteristics_rev10_a000_14mt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(drawData)
