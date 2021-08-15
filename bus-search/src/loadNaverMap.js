const ncpClientId = process.env.NCP_CLIENT_ID;
const naverMapScript = document.createElement("script");
const naverMapScriptSrc = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${ncpClientId}&submodules=geocoder`;
naverMapScript.setAttribute("src", naverMapScriptSrc);
document.head.appendChild(naverMapScript);

naverMapScript.addEventListener("load", function () {
  const $map = document.querySelector(".map");
  var mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10,
  };
  var map = new naver.maps.Map($map, mapOptions); // id와 option
});
