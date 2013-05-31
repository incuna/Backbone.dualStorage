(function() {
  describe('bugs, that once fixed, should be moved to the proper spec file and modified to test their inverse', function() {
    it('fails to throw an error when no storeName is provided to the Store constructor,\
      even though this will cause problems later.\
      The root cause is that the model has no url set; the error should reflect this.', function() {
      var createNamelessStore;
      createNamelessStore = function() {
        return new window.Store;
      };
      return expect(createNamelessStore).not.toThrow();
    });
    return describe('idAttribute being ignored', function() {
      var Role, RoleCollection, collection, model, setup, _ref;
      _ref = {}, Role = _ref.Role, RoleCollection = _ref.RoleCollection, collection = _ref.collection, model = _ref.model;
      beforeEach(function() {
        window.backboneSync.calls = [];
        window.localsync('clear', {}, {
          success: (function() {}),
          error: (function() {})
        });
        collection = new Backbone.Collection;
        collection.url = 'eyes/';
        model = new Backbone.Model;
        model.collection = collection;
        return model.set({
          id: 1
        });
      });
      setup = function(useIdAttribute) {
        Role = Backbone.Model.extend({
          idAttribute: useIdAttribute ? '_id' : void 0,
          urlRoot: "/roles"
        });
        return RoleCollection = Backbone.Collection.extend({
          model: Role,
          url: "/roles"
        });
      };
      it('does work with the default idAttribute, id', function() {
        var fetched, retrievedModel, saved;
        setup(false);
        saved = false;
        runs(function() {
          return model.save({
            vision: 'crystal'
          }, {
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
          id: 1
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
      return it('does not respect idAttribute on models (issue 24)', function() {
        var fetched, retrievedModel, saved;
        setup(true);
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
          id: 1
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
          return expect(retrievedModel.get('vision')).toBeUndefined();
        });
      });
    });
  });
}).call(this);
