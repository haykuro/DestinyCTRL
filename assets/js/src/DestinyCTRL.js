define(['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      // Do something awesome.... or not... whatever

      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        accounts[0].getVault().then(function(vault) {
          var $vault = $('#vault');

          vault.getAll().forEach(function(bucket) {
            var $bucket = $('<ul id="' + bucket.type + '" />');

            bucket.getItems().forEach(function(item) {
              var $item = $('<li />');
              var $icon = $('<img />')
                .attr('src', item.icon);

              $item.append($icon);
              $bucket.append($item);
            });

            $vault.append($bucket);
          });
        });
      }
    }).catch(function(err) {
      alert(err.Message);
    });
  };

  return DestinyCTRL;
});
