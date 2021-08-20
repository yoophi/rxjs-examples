import Map from "./map";
const ncpClientId = process.env.NCP_CLIENT_ID;
const naverMapScript = document.createElement("script");
const naverMapScriptSrc = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${ncpClientId}&submodules=geocoder`;
naverMapScript.setAttribute("src", naverMapScriptSrc);
document.head.appendChild(naverMapScript);

naverMapScript.addEventListener("load", function () {
  const $map = document.querySelector(".map");
  const map = new Map($map);
});
