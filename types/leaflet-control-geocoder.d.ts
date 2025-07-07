// types/leaflet-control-geocoder.d.ts
import * as L from "leaflet";

declare module "leaflet" {
  namespace Control {
    function geocoder(options?: GeocoderOptions): Geocoder;

    interface GeocoderOptions {
      defaultMarkGeocode?: boolean;
    }

    interface Geocoder extends L.Control {
      on(type: "markgeocode", fn: (event: GeocoderEvent) => void): this;
    }

    interface GeocoderEvent {
      geocode: {
        center: L.LatLng;
        name: string;
      };
    }
  }
}

// export = L.Control.geocoder;