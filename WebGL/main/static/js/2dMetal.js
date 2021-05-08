console.clear();
var textCtx = document.createElement("canvas").getContext("2d");

// Puts text in center of canvas.
function makeTextCanvas(text, width, height) {
  textCtx.canvas.width = width;
  textCtx.canvas.height = height;
  textCtx.font = "100px monospace";
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";
  textCtx.fillStyle = "black";
  textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
  textCtx.fillText(text, width / 2, height / 2);
  return textCtx.canvas;
}

const instancedQuadVertexShader = `#version 300 es

  /*
    Pass in geometry position and tex coord from the CPU
  */
  in vec4 a_position;
  in vec2 a_uv;
  /*
    This input vector will change once per instance
  */
  in vec4 a_offset;

  /*
    Pass in global projection matrix for each vertex
  */
  uniform mat4 u_projectionMatrix;

  /*
    Pass in global time for animation
  */
  uniform float u_time;

  /*
    Specify varying variable to be passed to fragment shader
  */
  out vec2 v_uv;

  void main () {
    vec4 newPosition = a_position + a_offset + vec4(
      sin(a_offset.y + u_time) * 20.0,
      cos(a_offset.x + u_time) * 20.0,
      0.0,
      0.0
    );

    gl_Position = u_projectionMatrix * newPosition;
    v_uv = a_uv;
  }
`;
const instancedQuadFragmentShader = `#version 300 es
  /*
    Set fragment shader float precision
  */
  precision highp float;

  /*
    Consume interpolated tex coord varying from vertex shader
  */
  in vec2 v_uv;

  /*
    Final color represented as a vector of 4 components - r, g, b, a
  */
  out vec4 outColor;

  void main () {
    float dist = distance(v_uv, vec2(0.5)) * 2.0;
    float c = 1.0 - dist;
    if (c <= 0.0) {
      discard;
    }
    outColor = vec4(vec3(1.0), c);
  }
`;

const fullscreenQuadVertexShader = `#version 300 es
   in vec4 a_position;
   in vec2 a_uv;
   
   uniform mat4 u_projectionMatrix;
   
   out vec2 v_uv;
   
   void main () {
    gl_Position = u_projectionMatrix * a_position;
    v_uv = a_uv;
   }
`;
const fullscreenQuadFragmentShader = `#version 300 es
  precision highp float;
  
  /*
    Pass our texture we render to as an uniform
  */
  uniform sampler2D u_texture;
  
  in vec2 v_uv;
  
  out vec4 outputColor;
  
  void main () {
    /*
      Use our interpolated UVs we assigned in Javascript to lookup
      texture color value at each pixel
    */
    vec4 inputColor = texture(u_texture, v_uv);
    
    /*
      0.5 is our alpha threshold we use to decide if
      pixel should be discarded or painted
    */
    float cutoffThreshold = 0.5;
    /*
      "cutoff" will be 0 if pixel is below 0.5 or 1 if above
      
      step() docs - https://thebookofshaders.com/glossary/?search=step
    */
    float cutoff = step(cutoffThreshold, inputColor.a);
    
    /*
      Let's use mix() GLSL method instead of if statement
      if cutoff is 0, we will discard the pixel by using empty color with no alpha
      otherwise, let's use pure red with alpha of 1
      
      mix() docs - https://thebookofshaders.com/glossary/?search=mix
    */
    vec4 emptyColor = vec4(0.0);
    /* Render black metaballs shapes */
    vec4 borderColor = vec4(0.0, 0.0, 0.0, 1.0);
    outputColor = mix(
      emptyColor,
      borderColor,
      cutoff
    );
    
    /*
      Increase the treshold and calculate new cutoff, so we can render smaller shapes
      again, this time in different color
    */
    cutoffThreshold += 0.015;
    cutoff = step(cutoffThreshold, inputColor.a);
    vec4 fillColor = vec4(0.922,0.871,0.204, 1);
    outputColor = mix(
      outputColor,
      fillColor,
      cutoff
    );
    //outputColor = inputColor;
    
  }
`;
let fullscreenQuadVertexBuffer;

const dpr = devicePixelRatio > 2 ? 2 : devicePixelRatio;
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");
const hint = document.getElementById("hint");
const hint2 = document.getElementById("hint2");

const textProgramInfo = webglUtils.createProgramInfo(gl, [
  "text-vertex-shader",
  "text-fragment-shader",
]);
const textBufferInfo = primitives.createPlaneBufferInfo(
  gl,
  0.5,
  0.5,
  1,
  1,
  m4.xRotation(Math.PI / 2)
);
var textUniforms = {
  u_matrix: m4.identity(),
  u_texture: null, // we'll set it at render time
  u_color: [0, 0, 0, 1], // black
};

// create text textures, one for each letter
var textTextures = [
  "a", // 0
  "b", // 1
  "c", // 2
  "d", // 3
  "e", // 4
  "f", // 5
  "g", // 6
  "h", // 7
  "i", // 8
  "j", // 9
  "k", // 10
  "l", // 11
  "m", // 12,
  "n", // 13,
  "o", // 14,
  "p", // 14,
  "q", // 14,
  "r", // 14,
  "s", // 14,
  "t", // 14,
  "u", // 14,
  "v", // 14,
  "w", // 14,
  "x", // 14,
  "y", // 14,
  "z", // 14,
].map(function (name) {
  var textCanvas = makeTextCanvas(name, canvas.width, canvas.height);
  var textWidth = textCanvas.width;
  var textHeight = textCanvas.height;
  var textTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textTex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  //gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, true);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textCanvas
  );
  // make sure we can render it even if it's not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return {
    texture: textTex,
    width: textWidth,
    height: textHeight,
  };
});

/* Check if device supports float or half-float textures */
const rgba32fSupported =
  gl.getExtension("EXT_color_buffer_float") &&
  gl.getExtension("OES_texture_float_linear");
const rgba16fSupported =
  gl.getExtension("EXT_color_buffer_half_float") &&
  gl.getExtension("OES_texture_half_float_linear");

if (rgba32fSupported || rgba16fSupported) {
  hint2.innerText = "click to toggle floating point texture";
} else {
  hint.parentNode.removeChild(hint);
  hint2.innerText = "Floating point textures not supported";
}

/* Size our canvas and listen for resize events */
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();

  /* Recreate our projection matrix with new viewport dimensions */
  const projectionMatrix = new Float32Array([
    2 / innerWidth,
    0,
    0,
    0,
    0,
    -2 / innerHeight,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,
    1,
    0,
    1,
  ]);
  const vertexArray = new Float32Array([
    0,
    innerHeight,
    innerWidth,
    innerHeight,
    innerWidth,
    0,
    0,
    innerHeight,
    innerWidth,
    0,
    0,
    0,
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenQuadVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  gl.useProgram(instancedQuadsProgram);
  let u_projectionMatrixLocation = gl.getUniformLocation(
    instancedQuadsProgram,
    "u_projectionMatrix"
  );
  gl.uniformMatrix4fv(u_projectionMatrixLocation, false, projectionMatrix);

  gl.useProgram(fullscreenQuadProgram);
  u_projectionMatrixLocation = gl.getUniformLocation(
    fullscreenQuadProgram,
    "u_projectionMatrix"
  );
  gl.uniformMatrix4fv(u_projectionMatrixLocation, false, projectionMatrix);
  gl.useProgram(null);

  gl.deleteTexture(renderTexture);
  gl.deleteFramebuffer(framebuffer);
  renderTexture = makeTexture();
  framebuffer = makeFramebuffer(renderTexture);
});

/* Append our canvas to the DOM and set its background-color with CSS */
// canvas.style.backgroundColor = '#555'
document.body.appendChild(canvas);

document.body.addEventListener("click", () => {
  useFloatTextureIfAvailable = !useFloatTextureIfAvailable;
  gl.deleteTexture(renderTexture);
  gl.deleteFramebuffer(framebuffer);
  renderTexture = makeTexture();
  framebuffer = makeFramebuffer(renderTexture);
});

/* Issue first frame paint */
requestAnimationFrame(updateFrame);

/* Enable WebGL alpha blending */
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

/* How many quads we want rendered */
const QUADS_COUNT = 1000;
/*
  Array to store our quads positions
  We need to layout our array as a continuous set
  of numbers, where each pair represents the X and Y
  of a single 2D position.
  
  Hence for 1000 quads we need an array of 2000 items
  or 1000 pairs of X and Y
*/
const quadsPositions = new Float32Array(QUADS_COUNT * 2);
for (let i = 0; i < QUADS_COUNT; i++) {
  /*
    Generate a random X and Y position
  */
  const randX = Math.random() * innerWidth * 2;
  const randY = Math.random() * innerHeight * 2;
  /*
    Set the correct X and Y for each pair in our array
  */
  quadsPositions[i * 2 + 0] = randX;
  quadsPositions[i * 2 + 1] = randY;
}

const {
  quadProgram: instancedQuadsProgram,
  quadVertexArrayObject: instancedQuadsVAO,
} = makeQuad({
  vertexShaderSource: instancedQuadVertexShader,
  fragmentShaderSource: instancedQuadFragmentShader,
  isInstanced: true,
  instancedOffsets: quadsPositions,
  width: 400,
  height: 400,
});

let enablePostprocessing = true;
let u_timeLocation;
let useFloatTextureIfAvailable = true;

gl.useProgram(instancedQuadsProgram);
u_timeLocation = gl.getUniformLocation(instancedQuadsProgram, "u_time");
gl.useProgram(null);

const {
  quadProgram: fullscreenQuadProgram,
  quadVertexArrayObject: fullscreenQuadVAO,
  vertexBuffer,
} = makeQuad({
  vertexShaderSource: fullscreenQuadVertexShader,
  fragmentShaderSource: fullscreenQuadFragmentShader,
  isInstanced: false,
  width: innerWidth,
  height: innerHeight,
  offsetX: innerWidth / 2,
  offsetY: innerHeight / 2,
});
fullscreenQuadVertexBuffer = vertexBuffer;
/*
  Unlike our instances GLSL program, here we need to pass an extra uniform - an u_texture
  Tell the shader to use texture unit 0 for u_texture
*/
gl.useProgram(fullscreenQuadProgram);
const u_textureLocation = gl.getUniformLocation(
  fullscreenQuadProgram,
  "u_texture"
);
gl.uniform1i(u_textureLocation, 0);
gl.useProgram(null);

let renderTexture = makeTexture();
let framebuffer = makeFramebuffer(renderTexture);

function makeTexture(
  textureWidth = canvas.width,
  textureHeight = canvas.height
) {
  let internalFormat = gl.RGBA;
  let type = gl.UNSIGNED_BYTE;

  hint.innerText = `float textures not supported`;

  if (useFloatTextureIfAvailable) {
    if (rgba32fSupported) {
      internalFormat = gl.RGBA32F;
      type = gl.FLOAT;
      hint.innerText = `rendering to 32bit float texture`;
    } else {
      if (rgba16fSupported) {
        internalFormat = gl.RGBA16F;
        type = gl.HALF_FLOAT;
        hint.innerText = `rendering to 16bit float texture`;
      }
    }
  } else {
    hint.innerText = `rendering to 8bit uint texture`;
  }

  /*
    Create the texture that we will use to render to
  */
  const targetTexture = gl.createTexture();
  /*
    Just like everything else in WebGL up until now, we need to bind it
    so we can configure it. We will unbind it once we are done with it.
  */
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);

  /*
    Define texture settings
  */
  const level = 0;
  const border = 0;
  const format = gl.RGBA;
  /*
    Notice how data is null. That's because we don't have data for this texture just yet
    We just need WebGL to allocate the texture
  */
  const data = null;
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    textureWidth,
    textureHeight,
    border,
    format,
    type,
    data
  );

  /*
    Set the filtering so we don't need mips
  */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return targetTexture;
}

function makeFramebuffer(texture) {
  /*
    Create and bind the framebuffer
  */
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  /*
    Attach the texture as the first color attachment
  */
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const level = 0;
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    texture,
    level
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return fb;
}

function makeQuad({
  isInstanced,
  instancedOffsets,
  vertexShaderSource,
  fragmentShaderSource,
  width = 30,
  height = 30,
  offsetX = 0,
  offsetY = 0,
  drawType = gl.STATIC_DRAW,
}) {
  /*
    Construct a WebGLProgram object out of our shader sources and link it on the GPU
  */
  const quadProgram = makeGLProgram(vertexShaderSource, fragmentShaderSource);

  /*
    Create a Vertex Array Object that will store a description of our geometry
    that we can reference later when rendering
  */
  const quadVertexArrayObject = gl.createVertexArray();

  const vertexArray = new Float32Array([
    /*
      First set of 3 points are for our first triangle
    */
    offsetX + -width / 2,
    offsetY + height / 2, // Vertex 1 (X, Y)
    offsetX + width / 2,
    offsetY + height / 2, // Vertex 2 (X, Y)
    offsetX + width / 2,
    offsetY + -height / 2, // Vertex 3 (X, Y)
    /*
      Second set of 3 points are for our second triangle
    */
    offsetX + -width / 2,
    offsetY + height / 2, // Vertex 4 (X, Y)
    offsetX + width / 2,
    offsetY + -height / 2, // Vertex 5 (X, Y)
    offsetX + -width / 2,
    offsetY + -height / 2, // Vertex 6 (X, Y)
  ]);

  /*
    Create a WebGLBuffer that will hold our triangles positions
  */
  const vertexBuffer = gl.createBuffer();
  /*
    Now that we've created a GLSL program on the GPU we need to supply data to it
    We need to supply our 32bit float array to the a_position variable used by the GLSL program
    
    When you link a vertex shader with a fragment shader by calling gl.linkProgram(someProgram)
    WebGL (the driver/GPU/browser) decide on their own which index/location to use for each attribute
    
    Therefore we need to find the location of a_position from our program
  */
  const a_positionLocationOnGPU = gl.getAttribLocation(
    quadProgram,
    "a_position"
  );

  /*
    Bind the Vertex Array Object descriptior for this geometry
    Each geometry instruction from now on will be recorded under it
    
    To stop recording after we are done describing our geometry, we need to simply unbind it
  */
  gl.bindVertexArray(quadVertexArrayObject);

  /*
    Bind the active gl.ARRAY_BUFFER to our WebGLBuffer that describe the geometry positions
  */
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  /*
    Feed our 32bit float array that describes our quad to the vertexBuffer using the
    gl.ARRAY_BUFFER global handler
  */
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, drawType);
  /*
    We need to explicitly enable our the a_position variable on the GPU
  */
  gl.enableVertexAttribArray(a_positionLocationOnGPU);
  /*
    Finally we need to instruct the GPU how to pull the data out of our
    vertexBuffer and feed it into the a_position variable in the GLSL program
  */
  /*
    Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  */
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    a_positionLocationOnGPU,
    size,
    type,
    normalize,
    stride,
    offset
  );

  /*
    2. Defining geometry UV texCoords
    
    V6  _______ V5         V3
       |      /         /|
       |    /         /  |
       |  /         /    |
    V4 |/      V1 /______| V2
  */
  const uvsArray = new Float32Array([
    0,
    0, // V1
    1,
    0, // V2
    1,
    1, // V3
    0,
    0, // V4
    1,
    1, // V5
    0,
    1, // V6
  ]);
  /*
    The rest of the code is exactly like in the vertices step above.
    We need to put our data in a WebGLBuffer, look up the a_uv variable
    in our GLSL program, enable it, supply data to it and instruct
    WebGL how to pull it out:
  */
  const uvsBuffer = gl.createBuffer();
  const a_uvLocationOnGPU = gl.getAttribLocation(quadProgram, "a_uv");
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvsArray, drawType);
  gl.enableVertexAttribArray(a_uvLocationOnGPU);
  gl.vertexAttribPointer(a_uvLocationOnGPU, 2, gl.FLOAT, false, 0, 0);

  if (isInstanced) {
    /*
      Add offset positions for our individual instances
      They are declared and used in exactly the same way as
      a_position and a_uv above
    */
    const offsetsBuffer = gl.createBuffer();
    const a_offsetLocationOnGPU = gl.getAttribLocation(quadProgram, "a_offset");
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, instancedOffsets, drawType);
    gl.enableVertexAttribArray(a_offsetLocationOnGPU);
    gl.vertexAttribPointer(a_offsetLocationOnGPU, 2, gl.FLOAT, false, 0, 0);
    /*
      HOWEVER, we must add an additional WebGL call gl.vertexAttribDivisor()
      It will set this attribute to only change for each 1 instance
    */
    gl.vertexAttribDivisor(a_offsetLocationOnGPU, 1);
  }

  /*
    Stop recording and unbind the Vertex Array Object descriptior for this geometry
  */
  gl.bindVertexArray(null);

  /*
    WebGL has a normalized viewport coordinate system which looks like this:
    
         Device Viewport
       ------- 1.0 ------  
      |         |        |
      |         |        |
    -1.0 -------------- 1.0
      |         |        | 
      |         |        |
       ------ -1.0 ------
       
     Yet, as you can see, we pass the position and size of our quad in actual pixels
     To convert these pixels values to the normalized coordinate system, we will
     use the simplest 2D projection matrix.
     It will be represented as an array of 16 32bit floats
     
     You can read a gentle introduction to 2D matrices here
     https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
  */
  const projectionMatrix = new Float32Array([
    2 / innerWidth,
    0,
    0,
    0,
    0,
    -2 / innerHeight,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,
    1,
    0,
    1,
  ]);

  /*
    In order to supply uniform data to our quad GLSL program, we first need to enable it
  */
  gl.useProgram(quadProgram);
  /*
    Just like the a_position attribute variable earlier, we also need to look up
    the location of uniform variables in the GLSL program in order to supply them data
  */
  const u_projectionMatrixLocation = gl.getUniformLocation(
    quadProgram,
    "u_projectionMatrix"
  );
  /*
    Supply our projection matrix as a Float32Array of 16 items to the u_projection uniform
  */
  gl.uniformMatrix4fv(u_projectionMatrixLocation, false, projectionMatrix);
  /*
    We have set up our uniform variables correctly, stop using the quad program for now
  */
  gl.useProgram(null);

  /*
    Return our GLSL program and the Vertex Array Object descriptor of our geometry
    We will need them to render our quad in our updateFrame method
  */
  return {
    vertexBuffer,
    quadProgram,
    quadVertexArrayObject,
  };
}

/*
  Utility method to create a WebGLShader object and compile it on the device GPU
  https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader
*/
function makeGLShader(shaderType, shaderSource) {
  /* Create a WebGLShader object with correct type */
  const shader = gl.createShader(shaderType);
  /* Attach the shaderSource string to the newly created shader */
  gl.shaderSource(shader, shaderSource);
  /* Compile our newly created shader */
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  /* Return the WebGLShader if compilation was a success */
  if (success) {
    return shader;
  }
  /* Otherwise log the error and delete the fauly shader */
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/*
  Utility method to create a WebGLProgram object
  It will create both a vertex and fragment WebGLShader and link them into a program on the device GPU
  https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
*/
function makeGLProgram(vertexShaderSource, fragmentShaderSource) {
  /* Create and compile vertex WebGLShader */
  const vertexShader = makeGLShader(gl.VERTEX_SHADER, vertexShaderSource);
  /* Create and compile fragment WebGLShader */
  const fragmentShader = makeGLShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  /* Create a WebGLProgram and attach our shaders to it */
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  /* Link the newly created program on the device GPU */
  gl.linkProgram(program);
  /* Return the WebGLProgram if linking was successfull */
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  /* Otherwise log errors to the console and delete fauly WebGLProgram */
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function updateFrame(timestampMs) {
  /*
     Render our scene. This will redraw our screen and paint it over as
     fast as possible. We want to be as close to 60FPS as possible for
     smooth animation.
   */

  /* Set our program viewport to fit the actual size of our monitor */
  gl.viewport(0, 0, canvas.width, canvas.height);
  /* Set the WebGL background colour to be transparent */
  gl.clearColor(0.2, 0.2, 0.2, 1);
  /* Clear the current canvas pixels */
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (enablePostprocessing) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    /* Set the offscreen framebuffer background colour to be transparent */
    gl.clearColor(0, 0, 0, 0);
    /* Clear the offscreen framebuffer pixels */
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /*
     Bind the Vertex Array Object descriptor of our quad we generated earlier
   */
  gl.bindVertexArray(instancedQuadsVAO);
  /*
     Use our quad GLSL program
   */
  gl.useProgram(instancedQuadsProgram);
  /*
     Update u_time uniform variable with new elapsed time
   */
  gl.uniform1f(u_timeLocation, timestampMs / 1000);
  /*
     Issue a render command to paint our quad triangles
   */
  {
    const drawPrimitive = gl.TRIANGLES;
    const vertexArrayOffset = 0;
    const numberOfVertices = 6; // 6 vertices = 2 triangles = 1 quad
    gl.drawArraysInstanced(
      drawPrimitive,
      vertexArrayOffset,
      numberOfVertices,
      QUADS_COUNT
    );
  }
  /*
     After a successful render, it is good practice to unbind our GLSL
     program and Vertex Array Object so we keep WebGL state clean.
     We will bind them again anyway on the next render
   */
  gl.useProgram(null);
  gl.bindVertexArray(null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  if (enablePostprocessing) {
    gl.bindVertexArray(fullscreenQuadVAO);
    gl.useProgram(fullscreenQuadProgram);
    {
      gl.bindTexture(gl.TEXTURE_2D, renderTexture);
      const drawPrimitive = gl.TRIANGLES;
      const vertexArrayOffset = 0;
      const numberOfVertices = 6; // 6 vertices = 2 triangles = 1 quad
      gl.drawArrays(drawPrimitive, vertexArrayOffset, numberOfVertices);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.useProgram(null);
    gl.bindVertexArray(null);
  }

  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  //gl.depthMask(false);

  gl.useProgram(textProgramInfo.program);
  webglUtils.setBuffersAndAttributes(gl, textProgramInfo, textBufferInfo);

  var name = "h";
  var pos = [500, 500, 500];
  const projectionMatrix = new Float32Array([
    2 / innerWidth,
    0,
    0,
    0,
    0,
    -2 / innerHeight,
    0,
    0,
    0,
    0,
    0,
    0,
    -1,
    1,
    0,
    1,
  ]);

  // for each leter
  for (var ii = 0; ii < name.length; ++ii) {
    var letter = name.charCodeAt(ii);
    var letterNdx = letter - "a".charCodeAt(0);

    // select a letter texture
    var tex = textTextures[letterNdx];

    // because pos is in view space that means it's a vector from the eye to
    // some position. So translate along that vector back toward the eye some distance
    var fromEye = m4.normalize(pos);
    //console.log(fromEye);
    var amountToMoveTowardEye = 150; // because the F is 150 units long
    var viewX = pos[0] - fromEye[0] * amountToMoveTowardEye;
    var viewY = pos[1] - fromEye[1] * amountToMoveTowardEye;
    var viewZ = pos[2] - fromEye[2] * amountToMoveTowardEye;
    var desiredTextScale = -1 / gl.canvas.height; // 1x1 pixels
    var scale = viewZ * desiredTextScale;
    var textMatrix = m4.translate(projectionMatrix, viewX, viewY, viewZ);
    // scale the F to the size we need it.
    textMatrix = m4.scale(textMatrix, tex.width * scale, tex.height * scale, 1);
    textMatrix = m4.translate(textMatrix, ii, 0, 0);

    //console.log(textMatrix);
    // // set texture uniform
    //m4.copy(textMatrix, textUniforms.u_matrix);
    textUniforms.u_texture = tex.texture;
    webglUtils.setUniforms(textProgramInfo, textUniforms);

    // Draw the text.
    gl.drawElements(
      gl.TRIANGLES,
      textBufferInfo.numElements,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  /* Issue next frame paint */
  requestAnimationFrame(updateFrame);
}

function resizeCanvas() {
  /*
      We need to account for devicePixelRatio when sizing our canvas.
      We will use it to obtain the actual pixel size of our viewport and size our canvas to match it.
      We will then downscale it back to CSS units so it neatly fills our viewport perfectly and we benefit from downsampling antialiasing
      We also need to limit it because it can really slow our program. Modern iPhones have devicePixelRatios of 3. This means rendering 9x more pixels each frame!
      More info: https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html 
   */
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
}
