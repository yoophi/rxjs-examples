function createNaverMap($map) {
  return new naver.maps.Map($map, {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 11,
    minZoom: 6,
  });
}

export default class Map {
  constructor($map) {
    this.naverMap = createNaverMap($map);
  }
}
