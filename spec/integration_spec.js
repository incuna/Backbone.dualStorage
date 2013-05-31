(function() {
  var collection, model, _ref;
  var __slice = Array.prototype.slice;
  _ref = {}, collection = _ref.collection, model = _ref.model;
  beforeEach(function() {
    window.backboneSync.calls = [];
    window.localsync('clear', {}, {
      ignoreCallbacks: true,
      storeName: 'eyes/'
    });
    collection = new Backbone.Collection({
      id: 123,
      vision: 'crystal'
    });
    collection.url = 'eyes/';
    return model = collection.models[0];
  });
  describe('using Backbone.sync directly', function() {
    return it('should save and retrieve data', function() {
      var errorCallback, fetched, saved, successCallback, _ref2;
      _ref2 = {}, successCallback = _ref2.successCallback, errorCallback = _ref2.errorCallback;
      saved = false;
      runs(function() {
        localStorage.clear();
        successCallback = jasmine.createSpy('success').andCallFake(function() {
          return saved = true;
        });
        errorCallback = jasmine.createSpy('error');
        return window.dualsync('create', model, {
          success: successCallback,
          error: errorCallback
        });
      });
      waitsFor((function() {
        return saved;
      }), "The success callback for 'create' should have been called", 100);
      runs(function() {
        expect(window.backboneSync.calls.length).toEqual(1);
        expect(successCallback).toHaveBeenCalled();
        expect(errorCallback).not.toHaveBeenCalled();
        return expect(window.localStorage.length).toBeGreaterThan(0);
      });
      fetched = false;
      runs(function() {
        successCallback = jasmine.createSpy('success').andCallFake(function(resp) {
          fetched = true;
          return expect(resp.get('vision')).toEqual('crystal');
        });
        errorCallback = jasmine.createSpy('error');
        return window.dualsync('read', model, {
          success: successCallback,
          error: errorCallback
        });
      });
      waitsFor((function() {
        return fetched;
      }), "The success callback for 'read' should have been called", 100);
      return runs(function() {
        expect(window.backboneSync.calls.length).toEqual(2);
        expect(successCallback).toHaveBeenCalled();
        return expect(errorCallback).not.toHaveBeenCalled();
      });
    });
  });
  describe('using backbone models and retrieving from local storage', function() {
    return it("fetches a model after saving it", function() {
      var fetched, retrievedModel, saved;
      saved = false;
      runs(function() {
        return model.save({}, {
          success: function() {
            return saved = true;
          }
        });
      });
      waitsFor((function() {
        return saved;
      }), "The success callback for 'save' should have been called", 100);
      fetched = false;
      retrievedModel = new Backbone.Model({
        id: 123
      });
      retrievedModel.collection = collection;
      runs(function() {
        return retrievedModel.fetch({
          remote: false,
          success: function() {
            return fetched = true;
          }
        });
      });
      waitsFor((function() {
        return fetched;
      }), "The success callback for 'fetch' should have been called", 100);
      return runs(function() {
        return expect(retrievedModel.get('vision')).toEqual('crystal');
      });
    });
  });
  describe('using backbone collections and retrieving from local storage', function() {
    return it('loads a collection after adding several models to it', function() {
      var fetched, saved;
      saved = 0;
      runs(function() {
        var id, newModel;
        for (id = 1; id <= 3; id++) {
          newModel = new Backbone.Model({
            id: id
          });
          newModel.collection = collection;
          newModel.save({}, {
            success: function() {
              return saved += 1;
            }
          });
        }
        return waitsFor((function() {
          return saved === 3;
        }), "The success callback for 'save' should have been called for id #" + id, 100);
      });
      fetched = false;
      runs(function() {
        return collection.fetch({
          remote: false,
          success: function() {
            return fetched = true;
          }
        });
      });
      waitsFor((function() {
        return fetched;
      }), "The success callback for 'fetch' should have been called", 100);
      return runs(function() {
        expect(collection.length).toEqual(3);
        return expect(collection.map(function(model) {
          return model.id;
        })).toEqual([1, 2, 3]);
      });
    });
  });
  describe('success and error callback parameters', function() {
    return it("passes back the response into the remote method's callback", function() {
      var callbackResponse;
      callbackResponse = null;
      runs(function() {
        model.remote = true;
        return model.fetch({
          success: function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return callbackResponse = args;
          }
        });
      });
      waitsFor((function() {
        return callbackResponse;
      }), "The success callback for 'fetch' should have been called", 100);
      return runs(function() {
        expect(callbackResponse[0]).toEqual(model);
        return expect(callbackResponse[1].updatedByRemoteSync).toBeTruthy;
      });
    });
  });
}).call(this);
