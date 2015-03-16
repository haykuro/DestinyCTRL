/**
 * Asset and logitics manager for Bungie's Destiny
 *
 * Copyright (c) 2015 DestinyCTRL
 *
 * Seth Benjamin <animecyc@gmail.com>
 * Arissa Brown <flipmodes01@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
{
  name : '../../../libs/almond',
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
    'components/vault',
    'components/character'
  ]
}
