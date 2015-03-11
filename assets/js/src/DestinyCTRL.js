define(['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      // Do something awesome.... or not... whatever
    }).catch(function(err) {
      alert(err.Message);
    });
  };

  return DestinyCTRL;
});
