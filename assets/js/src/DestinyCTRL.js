define(['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().catch(function() {
      alert('You\'re not logged in.');
    }).then(function() {
      var accounts = Bungie.getAccounts();

      accounts[0].getVault().then(function(data) {
        //
      });
    });
  };

  return DestinyCTRL;
});
