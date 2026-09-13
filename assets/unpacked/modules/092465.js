
      var o;
      var a;
      var r;
      a = [n(78559)];
      o = function (e) {
        e.RasterCoords = function (e, t, n) {
          this.map = e;
          this.width = t[0];
          this.height = t[1];
          this.tilesize = n || 256;
          this.zoom = this.zoomLevel();
          if (this.width && this.height) {
            this.setMaxBounds();
          }
        };
        e.RasterCoords.prototype = {
          zoomLevel: function () {
            return Math.ceil(Math.log(Math.max(this.width, this.height) / this.tilesize) / Math.log(2));
          },
          unproject: function (e) {
            return this.map.unproject(e, this.zoom);
          },
          project: function (e) {
            return this.map.project(e, this.zoom);
          },
          getMaxBounds: function () {
            var t = this.unproject([0, this.height]);
            var n = this.unproject([this.width, 0]);
            return new e.LatLngBounds(t, n);
          },
          setMaxBounds: function () {
            var e = this.getMaxBounds();
            this.map.setMaxBounds(e);
          }
        };
        return e.RasterCoords;
      };
      if ((r = (() => {
        if (typeof o === "function") {
          return o.apply(t, a);
        } else {
          return o;
        }
      })()) !== undefined) {
        e.exports = r;
      }
    }