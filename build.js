{
  name : '../../../almond',
  wrap : true,
  baseUrl : 'app/src/js',
  out : 'app/dist/js/app.js',
  optimize : 'none',
  generateSourceMaps : true,
  preserveLicenseComments : false,
  include : [
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
    'modules/vault'
  ]
}
