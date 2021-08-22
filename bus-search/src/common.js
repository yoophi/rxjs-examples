import { fromEvent, merge, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, partition, first, pluck, switchMap, share } from "rxjs/operators";

export function handleAjax(prop) {
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

export function parseHash() {
  const [routeId, routeNum] = location.hash.substring(1).split("_");
  return {
    routeId,
    routeNum,
  };
}

export function createShare$() {
  const changedHash$ = merge(
    fromEvent(window, "load"),
    fromEvent(window, "hashchange")
  ).pipe(
    map(() => parseHash()),
    share()
  );

  let [render$, search$] = changedHash$.pipe(
    partition(({ routeId }) => routeId)
  );
  render$ = render$.pipe(
    switchMap(({ routeId }) => ajax.getJSON(`/station/pass/${routeId}`)),
    handleAjax("busRouteStationList")
  );

  return {
    render$,
    search$: search$.pipe(geolocation),
  };
}

function geolocation() {
  const defaultPosition = {
    coords: {
      longitude: 126.9783882,
      latitude: 37.5666103,
    },
  };

  return new Observable((observer) => {
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => observer.next(position),
        (error) => observer.next(defaultPosition),
        {
          timeout: 1000,
        }
      );
    } else {
      observer.next(defaultPosition);
    }
  }).pipe(pluck("coords"), first());
}
