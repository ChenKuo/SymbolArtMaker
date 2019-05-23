#version 300 es
precision mediump float;

in vec2 TexCoord;

uniform sampler2D frame;  

out vec4 FragColor;

vec4 applyBSC(vec4 Color, float brightness, float saturation, float contrast)
{
	vec3 color_B  = Color.rgb * (1.0 +Color.a * (brightness -1.0));
	vec3 intensity = vec3(dot(color_B, vec3(0.2125, 0.7154, 0.0721)));
	vec3 color_BS  = mix(intensity, color_B, 1.0 + Color.a * (saturation -1.0));
	vec3 color_BSC  = mix(vec3(0.5, 0.5, 0.5), color_BS, 1.0 + Color.a * (contrast - 1.0));
	return vec4(color_BSC, Color.a);
}

void main()
{ 
    vec4 color = texture(frame, TexCoord);
    FragColor = applyBSC(color, 0.7, 0.9, 2.12);
}