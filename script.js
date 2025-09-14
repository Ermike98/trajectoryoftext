function download_svg() {
    const svg = render_trajectory_svg();
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trajectory_text.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// function download_png() {
//     const svgElement = render_trajectory_svg();
//     const svgData = new XMLSerializer().serializeToString(svgElement);
    
//     const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
//     const url = URL.createObjectURL(svgBlob);
  
//     const scaleFactor = 1.;

//     const img = new Image();
//     img.onload = function () {
//         const originalWidth = svgElement.viewBox.baseVal.width || svgElement.clientWidth;
//         const originalHeight = svgElement.viewBox.baseVal.height || svgElement.clientHeight;

//         const canvas = document.createElement("canvas");
//         canvas.width = originalWidth * scaleFactor;
//         canvas.height = originalHeight * scaleFactor;

//         const ctx = canvas.getContext("2d");
//         // ctx.scale(1/scaleFactor, 1/scaleFactor); // Scale the drawing context

//         ctx.drawImage(img, 0, 0);
//         URL.revokeObjectURL(url);
    
//         canvas.toBlob(function (blob) {
//             const a = document.createElement("a");
//             a.href = URL.createObjectURL(blob);
//             a.download = "trajectory_text.png";
//             a.click();
//         });
//     };
//     img.src = url;
// }

function download_png() {
    // Check if a canvas element was provided
    const canvas = document.getElementById('trajectoryCanvas');

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        console.error('Invalid canvas element provided.');
        return;
    }

    // Convert the canvas content to a data URL (PNG format by default)
    const imageURL = canvas.toDataURL('image/png');

    // Create a temporary anchor element
    const a = document.createElement('a');
    
    // Set the href attribute to the data URL
    a.href = imageURL;
    
    // Set the download attribute to the desired filename
    a.download = "trajectory_text.png";
    
    // Append the link to the document body, click it, and then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function refresh_graphics() {
    // Update parameters based on input field values
    params.text = document.getElementById("textInput").value;
    params.nRepeats = parseInt(document.getElementById("nRepeatsInput").value);
    params.textSize = parseInt(document.getElementById("textSizeInput").value);
    params.rotationStrength = parseFloat(document.getElementById("rotationStrengthInput").value);
    params.theta0 = parseFloat(document.getElementById("theta0Input").value);
    params.outerCircleSize = parseFloat(document.getElementById("outerCircleSizeInput").value);
    params.nLoops = parseInt(document.getElementById("nLoopsInput").value);
    params.expX = parseFloat(document.getElementById("expXInput").value);
    params.distX = parseFloat(document.getElementById("distXInput").value);
    params.expY = parseFloat(document.getElementById("expYInput").value);
    params.distY = parseFloat(document.getElementById("distYInput").value);
    // params.n1 = parseFloat(document.getElementById("n1Input").value);
    // params.n2 = parseFloat(document.getElementById("n2Input").value);
    params.nRatio = parseFloat(document.getElementById("nRatioInput").value);
    params.amplitude = parseFloat(document.getElementById("amplitudeInput").value);
    params.phase = parseFloat(document.getElementById("phaseInput").value);
    params.offset = parseFloat(document.getElementById("offsetInput").value);
    params.fontColor = document.getElementById("fontColorInput").value;
    params.bgColor = document.getElementById("bgColorInput").value;

    // Re-render the trajectory
    render_trajectory();

    // Save parameters
    saveParams();
}

function generate_random_graphics() {
    let random_trajectory = generate_random_trajectory_params()

    // Update parameters based on generate trajectory
    params.outerCircleSize = random_trajectory.outerCircleSize;
    params.nLoops = random_trajectory.nLoops;
    params.expX = random_trajectory.expX;
    params.distX = random_trajectory.distX;
    params.expY = random_trajectory.expY;
    params.distY = random_trajectory.distY;
    params.nRatio = random_trajectory.nRatio;
    params.amplitude = random_trajectory.amplitude;

    // Update form
    set_form_values()

    // Re-render the trajectory
    render_trajectory();

    // Save parameters
    saveParams();
}

// Save function (call this after user makes changes)
function saveParams() {
    localStorage.setItem("trajectoryOfTextParams", JSON.stringify(params));
    console.log("Parameters saved.");
}

// Load function
function loadParams() {
    const saved = localStorage.getItem("trajectoryOfTextParams");
    console.log("saved: ", saved)
    if (saved) {
        try {
            return { ...default_params, ...JSON.parse(saved) }; // Merge defaults with saved values
        } catch (e) {
            console.error("Failed to parse saved params. Using defaults.");
        }
    }
    return {...default_params};
}

// Optional: reset parameters and clear storage
function reset_params() {
    localStorage.removeItem("trajectoryOfTextParams");

    params = {...default_params}
}

function set_form_values() {
    document.getElementById("textInput").value = params.text;
    document.getElementById("nRepeatsInput").value = params.nRepeats;
    document.getElementById("textSizeInput").value = params.textSize;
    document.getElementById("rotationStrengthInput").value = params.rotationStrength;
    document.getElementById("theta0Input").value = params.theta0;
    document.getElementById("outerCircleSizeInput").value = params.outerCircleSize;
    document.getElementById("nLoopsInput").value = params.nLoops;
    document.getElementById("expXInput").value = params.expX;
    document.getElementById("distXInput").value = params.distX;
    document.getElementById("expYInput").value = params.expY;
    document.getElementById("distYInput").value = params.distY;
    document.getElementById("nRatioInput").value = params.nRatio;
    document.getElementById("amplitudeInput").value = params.amplitude;
    document.getElementById("phaseInput").value = params.phase;
    document.getElementById("offsetInput").value = params.offset;
    document.getElementById("fontColorInput").value = params.fontColor;
    document.getElementById("bgColorInput").value = params.bgColor;
}

function render_trajectory(){ 
    render_trajectory_canvas();
    // render_trajectory_svg();
}

// Function to render the trajectory graphic
function render_trajectory_svg() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    // const svg = document.getElementById('trajectorySVG');

    // Set the attributes for the SVG
    svg.setAttribute("id", "trajectorySVG");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    console.log(params)

    // let text = params.text;
    // let nRepeats = params.nRepeats;
    // let textSize = params.textSize;
    // let rotationStrength = params.rotationStrength;
    // let theta0 = params.theta0;
    // let outerCircleSize = params.outerCircleSize;
    // let nLoops = params.nLoops;
    // let n1 = params.n1;
    // let n2 = params.n2;
    // let amplitude = params.amplitude;
    // let phase = params.phase;
    // let offset = params.offset;
    // let fontColor = params.fontColor;
    // let bgColor = params.bgColor;
    // let fontBase64 = params.fontBase64;
    // let stepSize = 0.01

    let {
        text, nRepeats, textSize, rotationStrength, theta0,
        outerCircleSize, nLoops, expX, distX, expY, distY, nRatio,
        // n1, n2,
        amplitude, phase, offset, fontColor, bgColor, fontBase64
    } = params;

    const font_family = fontBase64 ? 'CustomFont' : "Courier New";

    // Clear the existing SVG content
    svg.innerHTML = '';

    // Embed the font using a style tag in the SVG
    if (fontBase64) {
        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
            @font-face {
                font-family: 'CustomFont';
                src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
            }
            text {
                font-family: 'CustomFont';
            }
        `;
        svg.appendChild(style);
    }

    let cx = width / 2;
    let cy = height / 2;

    const nPointsPerLoop = text.length * nRepeats;
    const nPoints = Math.floor(nPointsPerLoop * nLoops);
    
    // Create the SVG background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("x", 0);
    background.setAttribute("y", 0);
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("fill", bgColor);
    svg.appendChild(background);

    useUniformSpacing = true
    const allPoints = createPoints(
        nPoints, nPointsPerLoop, theta0, 
        cx, cy, outerCircleSize, 
        expX, distX, expY, distY,
        nRatio, amplitude, 
        phase, offset, text, rotationStrength, 
        useUniformSpacing
    )


    for (const point of allPoints) {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", point.px);
        textElement.setAttribute("y", point.py);
        textElement.setAttribute("fill", fontColor);
        textElement.setAttribute("font-size", textSize);
        textElement.setAttribute("font-family", font_family);
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("transform", `rotate(${(point.rotation * 180 / Math.PI)}, ${point.px}, ${point.py})`);
        textElement.textContent = point.char;
        svg.appendChild(textElement);
    }

    return svg
}

var glyphCache = {}; // Cache for pre-rendered glyph canvases

function getOrCreateGlyphCanvas(char, textSize, fontFamily, fontColor) {
    const cacheKey = `${char}_${textSize}_${fontFamily}_${fontColor}`;
    if (glyphCache[cacheKey]) {
        return glyphCache[cacheKey];
    }

    // Create an offscreen canvas
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');

    // Estimate canvas size (more than needed to account for rotation)
    const padding = 10;
    tmpCanvas.width = textSize * 2 + padding;
    tmpCanvas.height = textSize * 2 + padding;

    tmpCtx.font = `${textSize}px ${fontFamily}`;
    tmpCtx.fillStyle = fontColor;
    tmpCtx.textAlign = 'center';
    tmpCtx.textBaseline = 'middle';
    tmpCtx.fillText(char, tmpCanvas.width / 2, tmpCanvas.height / 2);

    glyphCache[cacheKey] = tmpCanvas;
    return tmpCanvas;
}

/*function createPoints(nPoints, nPointsPerLoop, theta0, cx, cy, outerCircleSize, n1, n2, amplitude, phase, offset, text, rotationStrength, textSize, font_family, fontColor) {
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        const s_outer = i / nPointsPerLoop;
        const theta_outer = s_outer * 2 * Math.PI + theta0;

        const p_outer_x = cx + outerCircleSize * Math.cos(theta_outer);
        const p_outer_y = cy + outerCircleSize * Math.sin(theta_outer);

        const p_outer_orth_x = -Math.cos(theta_outer);
        const p_outer_orth_y = -Math.sin(theta_outer);

        const theta_inner = (n1 / n2) * s_outer * 2 * Math.PI;

        const px = p_outer_x + p_outer_orth_x * (amplitude * Math.cos(theta_inner + phase / 180 * Math.PI) + offset);
        const py = p_outer_y + p_outer_orth_y * (amplitude * Math.sin(theta_inner + phase / 180 * Math.PI) + offset);

        const char = text[i % text.length];
        
        points.push({
            px: px,
            py: py,
            rotation: theta_inner * rotationStrength,
            char: char
        });
    }
    return points;
}*/

function createPoints(nPoints, nPointsPerLoop, theta0, cx, cy, outerCircleSize, expX, distX, expY, distY,nRatio, amplitude, phase, offset, text, rotationStrength, useUniformSpacing) {
    // A single array to hold our generated points, regardless of method
    const generatedPoints = [];

    // text = text.split("").reverse().join("")
    
    // First, generate the raw (non-uniform) points
    for (let i = 0; i < nPoints; i++) {
        const s_outer = i / nPointsPerLoop;
        const theta_outer = s_outer * 2 * Math.PI + theta0;

        const p_outer_x = cx + outerCircleSize * Math.cos(theta_outer);
        const p_outer_y = cy + outerCircleSize * Math.sin(theta_outer);

        const p_outer_orth_x = Math.pow(Math.abs(Math.sin(theta_outer)), expX) * distX;
        const p_outer_orth_y = Math.pow(Math.abs(Math.cos(theta_outer)), expY) * distY;

        // const p_outer_orth_x = 1;
        // const p_outer_orth_y = 1;

        const theta_inner = nRatio * s_outer * 2 * Math.PI;

        const px = p_outer_x + p_outer_orth_x * (amplitude * Math.cos(theta_inner + phase / 180 * Math.PI) + offset);
        const py = p_outer_y + p_outer_orth_y * (amplitude * Math.sin(theta_inner + phase / 180 * Math.PI) + offset);

        const char = text[i % text.length];

        generatedPoints.push({
            px: px,
            py: py,
            rotation: (theta_inner - Math.PI/2) * rotationStrength,
            // rotation: (theta_outer + Math.PI/2) * rotationStrength,
            char: char
        });
    }

    // return generatedPoints;

    // If we don't need uniform spacing, just return the raw points
    if (!useUniformSpacing) {
        return generatedPoints;
    }

    // If useUniformSpacing is true, proceed with the interpolation
    // 1. Compute the distance from one point to the next and the cumulative distance
    const distances = [0];
    const cumulativeDistances = [0];
    for (let i = 1; i < generatedPoints.length; i++) {
        const dx = generatedPoints[i].px - generatedPoints[i - 1].px;
        const dy = generatedPoints[i].py - generatedPoints[i - 1].py;
        distances.push(Math.sqrt(dx * dx + dy * dy));
        cumulativeDistances.push(cumulativeDistances[i - 1] + distances[i]);
    }

    const totalLength = cumulativeDistances[cumulativeDistances.length - 1];

    // 2. Create a new vector of cumulative distance uniformly spaced
    const newCumulativeDistances = [];
    for (let i = 0; i < nPoints; i++) {
        newCumulativeDistances.push(totalLength * (i / (nPoints - 1)));
    }

    // 3. Create the final vector of points using linear interpolation
    const finalPoints = [];
    let rawPointIndex = 0;

    for (let i = 0; i < nPoints; i++) {
        const targetDistance = newCumulativeDistances[i];
        
        while (rawPointIndex < generatedPoints.length - 1 && cumulativeDistances[rawPointIndex + 1] < targetDistance) {
            rawPointIndex++;
        }

        const p1 = generatedPoints[rawPointIndex];
        const d1 = cumulativeDistances[rawPointIndex];

        // Handle the last point case
        if (rawPointIndex + 1 >= generatedPoints.length) {
            finalPoints.push({
                px: p1.px,
                py: p1.py,
                rotation: p1.rotation,
                char: p1.char
            });
            continue;
        }

        const p2 = generatedPoints[rawPointIndex + 1];
        const d2 = cumulativeDistances[rawPointIndex + 1];

        const t = (targetDistance - d1) / (d2 - d1);

        const interpolatedX = p1.px + t * (p2.px - p1.px);
        const interpolatedY = p1.py + t * (p2.py - p1.py);
        const interpolatedRotation = p1.rotation + t * (p2.rotation - p1.rotation);

        const char = text[i % text.length];

        finalPoints.push({
            px: interpolatedX,
            py: interpolatedY,
            rotation: interpolatedRotation,
            char: char
        });
    }

    return finalPoints;
}

function render_trajectory_canvas() {
    const canvas = document.getElementById('trajectoryCanvas');
    const ctx = canvas.getContext('2d');

    let {
        text, nRepeats, textSize, rotationStrength, theta0,
        outerCircleSize, nLoops, expX, distX, expY, distY, nRatio,
        amplitude, phase, offset, fontColor, bgColor, fontBase64
    } = params;

    const font_family = fontBase64 ? 'CustomFont' : "Courier New";

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = width / 2;
    const cy = height / 2;

    const nPointsPerLoop = text.length * nRepeats;
    const nPoints = Math.floor(nPointsPerLoop * nLoops);

    // for (let i = 0; i < nPoints; i++) {
    //     const s_outer = i / nPointsPerLoop;
    //     const theta_outer = s_outer * 2 * Math.PI + theta0;

    //     const p_outer_x = cx + outerCircleSize * Math.cos(theta_outer);
    //     const p_outer_y = cy + outerCircleSize * Math.sin(theta_outer);

    //     const p_outer_orth_x = -Math.cos(theta_outer);
    //     const p_outer_orth_y = -Math.sin(theta_outer);

    //     const theta_inner = (n1 / n2) * s_outer * 2 * Math.PI;

    //     const px = p_outer_x + p_outer_orth_x * (amplitude * Math.cos(theta_inner + phase/180*Math.PI) + offset);
    //     const py = p_outer_y + p_outer_orth_y * (amplitude * Math.sin(theta_inner + phase/180*Math.PI) + offset);

    //     const char = text[i % text.length];
    //     const glyphCanvas = getOrCreateGlyphCanvas(char, textSize, font_family, fontColor);

    //     ctx.save();
    //     ctx.translate(px, py);
    //     ctx.rotate(theta_inner * rotationStrength);
    //     ctx.drawImage(
    //         glyphCanvas,
    //         -glyphCanvas.width / 2,
    //         -glyphCanvas.height / 2
    //     );
    //     ctx.restore();
    // }

    useUniformSpacing = true

    const allPoints = createPoints(
        nPoints, nPointsPerLoop, theta0, 
        cx, cy, outerCircleSize, 
        expX, distX, expY, distY,
        nRatio, amplitude, 
        phase, offset, text, rotationStrength, 
        useUniformSpacing)

    // const allPoints = createPoints(
    //     nPoints, 
    //     nPointsPerLoop, 
    //     theta0, 
    //     cx, 
    //     cy, 
    //     outerCircleSize, 
    //     n1, 
    //     n2, 
    //     amplitude, 
    //     phase, 
    //     offset, 
    //     text, 
    //     rotationStrength, 
    //     textSize, 
    //     font_family, 
    //     fontColor,
    //     false
    // );


    for (const point of allPoints) {
        const glyphCanvas = getOrCreateGlyphCanvas(point.char, textSize, font_family, fontColor);

        ctx.save();
        ctx.translate(point.px, point.py);
        ctx.rotate(point.rotation);
        ctx.drawImage(
            glyphCanvas,
            -glyphCanvas.width / 2,
            -glyphCanvas.height / 2
        );
        ctx.restore();
    }

    return canvas;
}

var width = 4000;
var height = 4000

// Default values
const default_params = {
    text: "|||||||||||||",
    nRepeats: 100,
    textSize: 22,
    rotationStrength: 1.0,
    theta0: 0,
    outerCircleSize: 800,
    nLoops: 47,
    expX: 0,
    distX: 0.7,
    expY: 0,
    distY: 0.7,
    nRatio: 0.602,
    amplitude: 200,
    phase: 0,
    offset: 0,
    fontColor: "#B8BBC5",
    bgColor: "#25272D",
    fontBase64: null
};

var params = loadParams()

function loadCustomFont(base64Font) {
    return new Promise((resolve, reject) => {
        const font = new FontFace('CustomFont', `url(data:font/ttf;base64,${base64Font})`);

        // Load the font
        font.load().then(() => {
            document.fonts.add(font);  // Register the font with the document
            resolve();  // Font loaded successfully
        }).catch(reject);  // Handle font load error
    });
}


document.addEventListener("DOMContentLoaded", function() {

    // Event listeners for input fields
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", refresh_graphics);
    });

    // Event listeners for input fields
    document.querySelectorAll("textarea").forEach(input => {
        input.addEventListener("input", refresh_graphics);
    });

    document.getElementById("fontUpload").addEventListener("change", function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
        
            reader.onload = function(e) {
                // Convert the font file to a Base64-encoded string
                params.fontBase64 = btoa(new Uint8Array(e.target.result).reduce(function (data, byte) {return data + String.fromCharCode(byte);}, ''));

                // Create a new @font-face rule dynamically with Base64 encoding
                const style = document.createElement('style');
                style.textContent = `
                    @font-face {
                        font-family: 'CustomFont';
                        src: url('data:font/ttf;base64,${params.fontBase64}') format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }
                `;
                document.head.appendChild(style);

                loadCustomFont(params.fontBase64);

                // Reset cache
                glyphCache = {};
                
                // Re-render the spiral
                render_trajectory();

                // Save parameters
                saveParams();
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Please upload a valid TTF font file.");
        }
    });    

    set_form_values();

    // Initial render
    render_trajectory();

    // Download the SVG
    const generateRandomTrajectory = document.getElementById('generate-random-trajectory');
    generateRandomTrajectory.addEventListener("click", generate_random_graphics);

    // Download the SVG
    const downloadSVGButton = document.getElementById('download-svg');
    downloadSVGButton.addEventListener("click", download_svg);

    // Download the PNG
    const downloadPNGButton = document.getElementById('download-png');
    downloadPNGButton.addEventListener("click", download_png);
    
    // Reset Parameters
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener("click", function() {
        reset_params();
        set_form_values();
        render_trajectory();
    });
});

function auto_height(elem) {  /* javascript */
    elem.style.height = '1px';
    console.log("elem.scrollHeight:", elem.scrollHeight )
    elem.style.height = `${elem.scrollHeight}px`;
}

function generate_random_trajectory_params() {
    // outer circle and wave amplitude
    const CIRCLE_WAVE_RATIOS = [0.25, .35, 0.5, .65, 0.75, 1, 1.25, 1.5, 2, 3, 4];

    let circle_wave_ratio = getRandomPosition(CIRCLE_WAVE_RATIOS);
    let max_size = getRandomInt(7, 15) * 100;

    outer_circle_size = max_size;
    wave_amplitude = Math.floor(circle_wave_ratio * max_size);
    
    if (circle_wave_ratio > 1){
        wave_amplitude = max_size;
        outer_circle_size = Math.floor(max_size / circle_wave_ratio);
    }

    // Exponents and Distorsions
    const EXPONENT_MANTISSAS = [0., 0., 0.25, 0.5, 0.75];
    symmetric_exp_mantissa = Math.random() < 0.3;
    exp_mantissa_x = getRandomPosition(EXPONENT_MANTISSAS);
    exp_mantissa_y = symmetric_exp_mantissa ? exp_mantissa_x : getRandomPosition(EXPONENT_MANTISSAS);
    
    symmetric_exp_integer = Math.random() < 0.7;
    exp_integer_x = Math.floor(-Math.log(getRandomPolyDist(1))*2);
    exp_integer_y = symmetric_exp_integer ? exp_integer_x : Math.floor(-Math.log(getRandomPolyDist(1))*2);
    console.log(exp_integer_x, exp_integer_y)


    exp_x = exp_integer_x + exp_mantissa_x;
    exp_y = exp_integer_y + exp_mantissa_y;

    symmetric_distorsion = Math.random() < 0.85;
    distorsion_x = floorWithDigits(getRandomUnifInterval(0.7, 1.6), 1);
    distorsion_y = symmetric_distorsion ? distorsion_x : floorWithDigits(getRandomUnifInterval(0.7, 1.6), 1);
    
    // N Ratio and Number of Loops
    const NUMBER_OF_LOOPS_RATIOS = [0.15, 0.25, .33, 0.5, 1., 1., ];
    n_ratio_integer = Math.floor(-Math.log(getRandomPolyDist(1)*2));
    n_ratio_mantissa = floorWithDigits(Math.random(), 3);
    n_ratio = n_ratio_integer + n_ratio_mantissa;

    let {a, b} = findFractionApproximation(n_ratio_mantissa, 250)
    n_loops = Math.ceil(b * getRandomPosition(NUMBER_OF_LOOPS_RATIOS));


    let trajectory_params = {
        outerCircleSize: outer_circle_size,
        nLoops: n_loops,
        expX: exp_x,
        distX: distorsion_x,
        expY: exp_y,
        distY: distorsion_y,
        nRatio: n_ratio,
        amplitude: wave_amplitude,
    };

    return trajectory_params
}



// --- Random Value Generation Functions ---

/**
 * Generates a uniform random floating-point number within a specified interval.
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (exclusive).
 * @returns {number} A random floating-point number.
 */
function getRandomUnifInterval(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a uniform random integer within a specified interval.
 * Both the minimum and maximum values are inclusive.
 * @param {number} min - The minimum integer value (inclusive).
 * @param {number} max - The maximum integer value (inclusive).
 * @returns {number} A random integer.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPolyDist(degree) {
    x = 1;
    for (let i = 0; i < degree; i++) {
        x *= Math.random();
    }

    return x
}

/**
 * Gets a random element from an array.
 * @param {Array} arr - The input array.
 * @returns {*} A randomly selected element from the array, or undefined if the array is empty.
 */
function getRandomPosition(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return undefined;
    }
    const randomIndex = getRandomInt(0, arr.length - 1);
    return arr[randomIndex];
}

// --- Number Approximation Function ---
// This function uses the Continued Fraction Algorithm, which is the most
// mathematically sound way to find the best rational approximation.

/**
 * Finds the best rational approximation (a/b) for a given number x.
 * The function uses the continued fraction algorithm.
 * @param {number} x - The number to approximate.
 * @param {number} [maxDenominator=1000] - The maximum denominator to search for an approximation.
 * @returns {{a: number, b: number}} An object containing the numerator (a) and denominator (b)
 * of the best approximation found.
 */
function findFractionApproximation(x, maxDenominator = 1000) {
    if (x === 0) {
        return { a: 0, b: 1 };
    }

    // Handle negative numbers by approximating the absolute value and adjusting the sign
    const sign = Math.sign(x);
    x = Math.abs(x);

    // Initial values for the recurrence relations of the continued fraction algorithm
    let a_n = Math.floor(x);
    let p_n_minus_2 = 1;
    let q_n_minus_2 = 0;
    let p_n_minus_1 = a_n;
    let q_n_minus_1 = 1;
    
    let p_n = p_n_minus_1;
    let q_n = q_n_minus_1;
    
    let bestApproximation = { a: p_n * sign, b: q_n };

    // Loop to find the next convergent
    while (true) {
        // Stop if the denominator exceeds the maximum limit or if the fractional part is zero
        if (q_n > maxDenominator) {
        break;
        }
        
        // The current fraction is the best approximation for its denominator size
        bestApproximation = { a: p_n * sign, b: q_n };
        
        // Calculate the next number in the continued fraction sequence
        let fractionalPart = x - a_n;
        if (fractionalPart === 0) {
        break;
        }
        x = 1 / fractionalPart;

        // Get the next integer part for the recurrence
        a_n = Math.floor(x);

        // Calculate the next numerator and denominator using the recurrence relation
        p_n = a_n * p_n_minus_1 + p_n_minus_2;
        q_n = a_n * q_n_minus_1 + q_n_minus_2;

        // Shift the values for the next iteration
        p_n_minus_2 = p_n_minus_1;
        q_n_minus_2 = q_n_minus_1;
        p_n_minus_1 = p_n;
        q_n_minus_1 = q_n;
    }

    return bestApproximation;
}


function floorWithDigits(x, n_digits) {
    pow_10 = Math.pow(10, n_digits)
    return Math.floor(x * pow_10) / pow_10
}