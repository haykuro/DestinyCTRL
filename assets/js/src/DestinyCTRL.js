define(['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      var accounts = Bungie.getAccounts();

      accounts[0].getVault().then(function(vault) {
        console.log(vault);
      });
    });
  };

  return DestinyCTRL;
});
