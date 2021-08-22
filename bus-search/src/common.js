import { map } from "rxjs/operators";

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
