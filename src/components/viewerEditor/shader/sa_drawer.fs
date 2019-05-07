#version 330 core

in vec2 vUV;
in vec4 vColor;
in float vIsFullColor;
in vec4 vAlphaChannel;


out vec4 FragColor;

uniform sampler2D myTextureSampler;

void main(){
	vec4 texture = texture2D( myTextureSampler, vUV);
	vec3 texColor = vIsFullColor * (texture.rgb - vec3(1.0)); //<0,0,0> if single channel
	float texAlpha = dot(texture,vAlphaChannel);

	vec3 color = vColor.rgb + texColor;
	float alpha = vColor.a * texAlpha;
	FragColor = vec4(color, alpha);
}