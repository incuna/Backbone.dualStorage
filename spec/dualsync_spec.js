(function() {
  var collection, model, spyOnLocalsync, _ref;
  var __slice = Array.prototype.slice;
  _ref = {}, collection = _ref.collection, model = _ref.model;
  beforeEach(function() {
    window.backboneSync.calls = [];
    window.localStorage.clear();
    collection = new Backbone.Collection({
      id: 12,
      position: 'arm'
    });
    collection.url = 'bones/';
    delete collection.remote;
    model = collection.models[0];
    return delete model.remote;
  });
  spyOnLocalsync = function() {
    return spyOn(window, 'localsync').andCallFake(function(method, model, options) {
      if (!options.ignoreCallbacks) {
        return typeof options.success === "function" ? options.success() : void 0;
      }
    });
  };
  describe('delegating to localsync and backboneSync, and calling the model callbacks', function() {
    describe('dual tier storage', function() {
      describe('create', function() {
        return it('delegates to both localsync and onlinesync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return window.dualsync('create', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(window.backboneSync).toHaveBeenCalled();
            expect(window.backboneSync.calls[0].args[0]).toEqual('create');
            expect(window.localsync).toHaveBeenCalled();
            return expect(window.localsync.calls[0].args[0]).toEqual('create');
          });
        });
      });
      describe('read', function() {
        return it('delegates to both localsync and onlinesync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return window.dualsync('read', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(window.backboneSync).toHaveBeenCalled();
            expect(_(window.backboneSync.calls).any(function(call) {
              return call.args[0] === 'read';
            }));
            expect(window.localsync).toHaveBeenCalled();
            return expect(_(window.localsync.calls).any(function(call) {
              return call.args[0] === 'read';
            }));
          });
        });
      });
      describe('update', function() {
        return it('delegates to both localsync and onlinesync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return window.dualsync('update', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(window.backboneSync).toHaveBeenCalled();
            expect(_(window.backboneSync.calls).any(function(call) {
              return call.args[0] === 'update';
            }));
            expect(window.localsync).toHaveBeenCalled();
            return expect(_(window.localsync.calls).any(function(call) {
              return call.args[0] === 'update';
            }));
          });
        });
      });
      return describe('delete', function() {
        return it('delegates to both localsync and onlinesync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return window.dualsync('delete', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(window.backboneSync).toHaveBeenCalled();
            expect(_(window.backboneSync.calls).any(function(call) {
              return call.args[0] === 'delete';
            }));
            expect(window.localsync).toHaveBeenCalled();
            return expect(_(window.localsync.calls).any(function(call) {
              return call.args[0] === 'delete';
            }));
          });
        });
      });
    });
    describe('respects the remote only attribute on models', function() {
      it('delegates for remote models', function() {
        var ready;
        ready = false;
        runs(function() {
          model.remote = true;
          return window.dualsync('create', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(window.backboneSync).toHaveBeenCalled();
          return expect(window.backboneSync.calls[0].args[0]).toEqual('create');
        });
      });
      return it('delegates for remote collections', function() {
        var ready;
        ready = false;
        runs(function() {
          collection.remote = true;
          return window.dualsync('read', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(window.backboneSync).toHaveBeenCalled();
          return expect(window.backboneSync.calls[0].args[0]).toEqual('read');
        });
      });
    });
    describe('respects the local only attribute on models', function() {
      it('delegates for local models', function() {
        var ready;
        spyOnLocalsync();
        ready = false;
        runs(function() {
          model.local = true;
          window.backboneSync.reset();
          return window.dualsync('update', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(window.localsync).toHaveBeenCalled();
          return expect(window.localsync.calls[0].args[0]).toEqual('update');
        });
      });
      return it('delegates for local collections', function() {
        var ready;
        ready = false;
        runs(function() {
          collection.local = true;
          window.backboneSync.reset();
          return window.dualsync('delete', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          return expect(window.backboneSync).not.toHaveBeenCalled();
        });
      });
    });
    return it('respects the remote: false sync option', function() {
      var ready;
      ready = false;
      runs(function() {
        window.backboneSync.reset();
        return window.dualsync('create', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      return runs(function() {
        return expect(window.backboneSync).not.toHaveBeenCalled();
      });
    });
  });
  describe('offline storage', function() {
    return it('marks records dirty when options.remote is false, except if the model/collection is marked as local', function() {
      var ready;
      spyOnLocalsync();
      ready = void 0;
      runs(function() {
        ready = false;
        collection.local = true;
        return window.dualsync('update', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      runs(function() {
        expect(window.localsync).toHaveBeenCalled();
        expect(window.localsync.calls.length).toEqual(1);
        return expect(window.localsync.calls[0].args[2].dirty).toBeFalsy();
      });
      runs(function() {
        window.localsync.reset();
        ready = false;
        collection.local = false;
        return window.dualsync('update', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      return runs(function() {
        expect(window.localsync).toHaveBeenCalled();
        expect(window.localsync.calls.length).toEqual(1);
        return expect(window.localsync.calls[0].args[2].dirty).toBeTruthy();
      });
    });
  });
  describe('dualStorage hooks', function() {
    beforeEach(function() {
      var ready;
      model.parseBeforeLocalSave = function() {
        return new Backbone.Model({
          parsedRemote: true
        });
      };
      ready = false;
      runs(function() {
        return window.dualsync('create', model, {
          success: (function() {
            return ready = true;
          })
        });
      });
      return waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
    });
    return it('filters read responses through parseBeforeLocalSave when defined on the model or collection', function() {
      var response;
      response = null;
      runs(function() {
        return window.dualsync('read', model, {
          success: function() {
            var callback_args;
            callback_args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return response = callback_args;
          }
        });
      });
      waitsFor((function() {
        return response;
      }), "The success callback should have been called", 100);
      return runs(function() {
        return expect(response[0].get('parsedRemote') || response[1].get('parsedRemote')).toBeTruthy();
      });
    });
  });
}).call(this);
