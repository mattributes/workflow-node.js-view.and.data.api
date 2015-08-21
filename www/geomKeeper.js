var GeomKeeper = function() {
  this._geoms = {};
};

GeomKeeper.getOrCreateInstance = function() {
  if (!this._instance){
    this._instance = new GeomKeeper();
  }
  this._instance._reset();
  return this._instance;
}

GeomKeeper.prototype._reset = function() {
  _(this._geoms).each(function(geom) {
    app.getViewerCanvas().impl.scene.remove(geom);
  });
  this._geoms = {};
  app.invalidate();
};

GeomKeeper.prototype.addGeometry = function(geom) {
  app.getViewerCanvas().impl.scene.add(geom);
  app.invalidate();
  this._geoms[geom.id] = geom;
  return geom.id;
};

GeomKeeper.prototype.getGeometry = function(id) {
  if (!(id in this._geoms)) {
    throw new Error('invalid id');
  }
  return this._geoms[id];
};

GeomKeeper.prototype.removeGeometry = function(id) {
  geom = this.getGeometry(id);
  app.getViewerCanvas().impl.scene.remove(geom);
  app.invalidate();
  delete this._geoms[id];
};

