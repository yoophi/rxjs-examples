import { createShare$ } from "./common";
import AutoComplete from "./autocomplete";
import Map from "./map";
const ncpClientId = process.env.NCP_CLIENT_ID;
const naverMapScript = document.createElement("script");
const naverMapScriptSrc = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${ncpClientId}&submodules=geocoder`;
naverMapScript.setAttribute("src", naverMapScriptSrc);
document.head.appendChild(naverMapScript);

naverMapScript.addEventListener("load", function () {
  const { render$, search$ } = createShare$();

  const search = new AutoComplete(document.querySelector(".autocomplete"));
  const map = new Map(document.querySelector(".map"));

  render$.subscribe(console.log);
});
