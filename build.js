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
    'modules/character',
  ],
  paths : {
    mithril : 'vendor/mithril',
    jquery : 'vendor/jquery',
    tooltips : 'vendor/jquery.tooltipster'
  },
  shim : {
    tooltips : ['jquery']
  },
  out : 'assets/js/dist/main.js',
  wrap : true,
  optimize : 'none',
  generateSourceMaps : true,
  preserveLicenseComments : false
}
