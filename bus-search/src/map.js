import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, switchMap } from "rxjs/operators";

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

    const station$ = this.createDragend$().pipe(this.mapStation);

    station$.subscribe(console.log);
  }

  createDragend$() {
    return fromEvent(this.naverMap, "dragend").pipe(
      map(({ coord }) => ({
        latitude: coord.y,
        longitude: coord.x,
      }))
    );
  }

  mapStation(coord$) {
    return coord$.pipe(
      switchMap((coord) =>
        ajax.getJSON(`/station/around/${coord.longitude}/${coord.latitude}`)
      )
    );
  }
}
