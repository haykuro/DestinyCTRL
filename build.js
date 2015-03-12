{
  baseUrl : 'assets/js/src',
  name : 'vendor/almond',
  include : [
    'main',
    'DestinyCTRL',
    'common/api',
    'common/bungie',
    'common/utils',
    'common/authorizer',
    'models/account',
    'models/character',
    'models/vault',
    'models/bucket',
    'models/item',
    'models/equipment',
    'modules/vault',
  ],
  paths : {
    mithril : 'vendor/mithril',
    opentip : 'vendor/opentip'
  },
  shim : {
    opentip : { exports : 'Opentip' }
  },
  out : 'assets/js/dist/main.js',
  wrap : true,
  optimize : 'none',
  generateSourceMaps : true,
  preserveLicenseComments : false
}
