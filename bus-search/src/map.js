import { combineLatest, fromEvent, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { handleAjax } from "./common";

function createNaverMap($map) {
  return new naver.maps.Map($map, {
    // center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 14,
    minZoom: 6,
  });
}

function createNaverInfoWindow() {
  return new naver.maps.InfoWindow();
}

function getBuesType(name) {
  if (/^광역/.test(name)) {
    return "yellow";
  } else if (/^직행/.test(name)) {
    return "red";
  } else {
    return "";
  }
}

export default class Map {
  constructor($map) {
    this.naverMap = createNaverMap($map);
    this.infowindow = createNaverInfoWindow();

    const station$ = this.createDragend$().pipe(
      this.mapStation,
      this.manageMarker.bind(this),
      this.mapMarkerClick,
      this.mapBus
    );

    station$.subscribe(({ markerInfo, buses }) => {
      if (this.isOpenInfoWindow(markerInfo.position)) {
        this.openInfoWindow(
          markerInfo.marker,
          markerInfo.position,
          this.render(buses, markerInfo)
        );
      } else {
        this.closeInfoWindow();
      }
    });
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
      handleAjax("busStationAroundList")
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

  mapMarkerClick(marker$) {
    return marker$.pipe(
      mergeMap((marker) => fromEvent(marker, "click")),
      map(({ overlay }) => ({
        marker: overlay,
        position: overlay.getPosition(),
        id: overlay.getOptions("id"),
        name: overlay.getOptions("name"),
      }))
    );
  }

  mapBus(markerInfo$) {
    return markerInfo$.pipe(
      switchMap((markerInfo) => {
        const marker$ = of(markerInfo);
        const bus$ = ajax
          .getJSON(`/bus/pass/station/${markerInfo.id}`)
          .pipe(handleAjax("busRouteList"));
        return combineLatest(marker$, bus$, (marker, buses) => ({
          buses,
          markerInfo,
        }));
      })
    );
  }

  isOpenInfoWindow(position) {
    return !(
      position.equals(this.infowindow.getPosition()) && this.infowindow.getMap()
    );
  }

  closeInfoWindow() {
    this.infowindow.close();
  }

  openInfoWindow(marker, position, content) {
    this.naverMap.panTo(position, { duration: 30 });
    this.infowindow.setContent(content);
    this.infowindow.open(this.naverMap, marker);
  }

  render(buses, { name }) {
    const list = buses
      .map(
        (bus) => `
        <dd>
          <a href="#${bus.routeId}_${bus.routeName}">
            <strong>${bus.routeName}</strong> 
            <span>${bus.regionName}</span> 
            <span class="type ${getBuesType(bus.routeTypeName)}">${
          bus.routeTypeName
        }</span>
          </a>
        </dd>`
      )
      .join("");

    return `
      <dl class="bus-routes">
        <dt><strong>${name}</strong></dt>
        ${list}
      </dl>`;
  }
}
