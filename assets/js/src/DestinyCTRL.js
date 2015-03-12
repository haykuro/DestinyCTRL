define(['common/bungie', 'common/utils'], function(Bungie, Util) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      require(['modules/vault']);
    }).catch(function(err) {
      console.error(err.Message);
    });
  };

  return DestinyCTRL;
});
