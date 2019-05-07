#version 330 core

// Input vertex data, different for all executions of this shader.
layout(location = 0) in uint type;
layout(location = 1) in uvec4 color;
layout(location = 2) in ivec2 position;
layout(location = 3) in uint corner;

// Output data ; will be interpolated for each fragment.
out vec2 vUV;
out vec4 vColor;
out float vIsFullColor;
out vec4 vAlphaChannel;

const float bitSizeX = 1.0 / 96.0;
const float bitSizeY = 1.0 / 48.0;
const float bitSizeZ = 1.0 / 256.0;
const vec3 bitSize = vec3(bitSizeX, bitSizeY, bitSizeZ);
const vec2 uvUnit = vec2(0.0625, 0.125);
const float colorUnit = 1.0 / 255.0;
const float alphaUnit = 1.0 / 8.0;

void main(){
	gl_Position = vec4(position * bitSize, 0.0, 1.0);
	vec2 uv_offset = vec2((corner>>1), corner&1u^1u);
	//u=t/4%16
	//v=t/4/16
	//c=t%4
	uint fullColor = (type >> 9); //1 means fullcolor, otw 0
	vec2 uv0_noColor = vec2((type >> 2) & 15u, (type >> 6));
	vec2 uv0_color = vec2((type + 2u) & 15u, 5u+(((type & 63u) + 2u) >> 4));
	vec2 uv0 = uv0_noColor * (fullColor ^ 1u) + uv0_color * fullColor;
	vUV = (uv0 + uv_offset)*uvUnit;

	vec4 Color = vec4(color.rgb*colorUnit, color.a*alphaUnit);
	vColor=Color;
	vIsFullColor = float(fullColor);
	uint c = (type & 3u) | (fullColor * 3u);
	vAlphaChannel = vec4(c == 0u, c == 1u, c == 2u, c == 3u);
}

