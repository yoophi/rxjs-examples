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

export function hadnleAjax(prop) {
  return (obs$) =>
    obs$.pipe(
      map((jsonRes) => {
        if (jsonRes.error) {
          if (jsonRes.error.code === "4") {
            return [];
          } else {
            throw jsonRes.error;
          }
        } else {
          if (Array.isArray(jsonRes[prop])) {
            return jsonRes[prop];
          } else {
            if (jsonRes[prop]) {
              return [jsonRes[prop]];
            } else {
              return [];
            }
          }
        }
      })
    );
}

export default class Map {
  constructor($map) {
    this.naverMap = createNaverMap($map);

    const station$ = this.createDragend$().pipe(
      this.mapStation,
      this.manageMarker.bind(this)
    );

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

  createMarker(name, x, y) {
    return new naver.maps.Marker({
      map: this.naverMap,
      title: name,
      position: new naver.maps.LatLng(y, x),
    });
  }

  mapStation(coord$) {
    return coord$.pipe(
      switchMap((coord) =>
        ajax.getJSON(`/station/around/${coord.longitude}/${coord.latitude}`)
      ),
      hadnleAjax("busStationAroundList")
    );
  }

  manageMarker(station$) {
    return station$.pipe(
      map((stations) =>
        stations.map((station) => {
          const marker = this.createMarker(
            station.stationName,
            station.x,
            station.y
          );
          marker.setOptions("id", station.stationId);
          marker.setOptions("name", station.stationName);
          return marker;
        })
      )
    );
  }
}
