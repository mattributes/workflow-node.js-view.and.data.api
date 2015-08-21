var GeomKeeper = function() {
  this._geoms = {};
  this._next  = 0;
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
  this._next = 0;
  app.invalidate();
};

GeomKeeper.prototype.addGeometry = function(geom) {
  app.getViewerCanvas().impl.scene.add(geom);
  app.invalidate();
  this._geoms[this._next] = geom;
  return this._next++;
};

GeomKeeper.prototype.getGeometry = function(idx) {
  if (!(idx in this._geoms)) {
    throw new Error('invalid idx');
  }
  if (!(idx < this._next)) {
    throw new Error('invalid idx');
  }
  return this._geoms[idx];
};

GeomKeeper.prototype.removeGeometry = function(idx) {
  geom = this.getGeometry(idx);
  app.getViewerCanvas().impl.scene.remove(geom);
  app.invalidate();
  delete this._geoms[idx];
};
