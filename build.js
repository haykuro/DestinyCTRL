{
  baseUrl : 'assets/js/src',
  name : 'vendor/almond',
  include : [
    'main',
    'DestinyCTRL',
    'common/api',
    'common/bungie',
    'common/utils',
    'models/account',
    'models/character',
    'models/vault',
    'models/bucket',
    'models/item'
  ],
  out : 'assets/js/dist/main.js',
  wrap : true,
  optimize : 'uglify2',
  generateSourceMaps : true,
  preserveLicenseComments : false
}
